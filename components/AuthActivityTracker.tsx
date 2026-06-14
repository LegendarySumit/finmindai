"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";

const SCROLL_MILESTONES = [25, 50, 75, 100];
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-track]';

const trimText = (value?: string | null, maxLength = 140) => {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : null;
};

const getCurrentFullPath = () => {
  if (typeof window === "undefined") {
    return "/";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

const getScrollDepth = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return 0;
  }

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) {
    return 100;
  }

  return Math.min(
    100,
    Math.max(0, Math.round((window.scrollY / scrollableHeight) * 100)),
  );
};

const getElementMetadata = (element: HTMLElement) => ({
  elementTag: element.tagName.toLowerCase(),
  label: trimText(
    element.getAttribute("aria-label") ||
      element.getAttribute("title") ||
      element.getAttribute("name") ||
      ("innerText" in element ? element.innerText : "") ||
      element.id,
  ),
  href:
    element instanceof HTMLAnchorElement ? element.getAttribute("href") : null,
  id: element.id || null,
  role: element.getAttribute("role") || null,
  sectionId: element.closest("[id]")?.getAttribute("id") || null,
});

const getFormMetadata = (form: HTMLFormElement) => ({
  formId: form.id || null,
  formName: form.getAttribute("name") || null,
  method: form.getAttribute("method") || "get",
  action: form.getAttribute("action") || null,
  fieldCount: form.elements.length,
});

const getFieldMetadata = (
  field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
) => ({
  fieldName: field.getAttribute("name") || field.id || null,
  fieldType:
    field instanceof HTMLTextAreaElement
      ? "textarea"
      : field.type || field.tagName.toLowerCase(),
  formId: field.form?.id || null,
  placeholder: trimText(field.getAttribute("placeholder"), 80),
});

const AuthActivityTracker = () => {
  const pathname = usePathname();
  const { user, trackActivity } = useAuth();
  const pageViewKeyRef = useRef<string | null>(null);
  const pageSessionKeyRef = useRef<string | null>(null);
  const pageStartRef = useRef<number>(0);
  const sessionStartedForUserRef = useRef<string | null>(null);
  const maxScrollDepthRef = useRef(0);
  const clickCountRef = useRef(0);
  const formSubmitCountRef = useRef(0);
  const fieldChangeCountRef = useRef(0);
  const visibilityChangeCountRef = useRef(0);
  const sectionNavigationCountRef = useRef(0);
  const scrollMilestonesRef = useRef<Set<number>>(new Set());
  const lastEngagementFlushRef = useRef<string | null>(null);

  const resetPageMetrics = () => {
    pageStartRef.current = Date.now();
    maxScrollDepthRef.current = getScrollDepth();
    clickCountRef.current = 0;
    formSubmitCountRef.current = 0;
    fieldChangeCountRef.current = 0;
    visibilityChangeCountRef.current = 0;
    sectionNavigationCountRef.current = 0;
    scrollMilestonesRef.current = new Set();
    lastEngagementFlushRef.current = null;
  };

  const flushPageEngagement = useCallback(
    (exitReason: string) => {
      if (
        !user ||
        !pageSessionKeyRef.current ||
        lastEngagementFlushRef.current === pageSessionKeyRef.current
      ) {
        return;
      }

      const durationMs = Date.now() - pageStartRef.current;
      if (
        durationMs < 1000 &&
        clickCountRef.current === 0 &&
        formSubmitCountRef.current === 0 &&
        fieldChangeCountRef.current === 0 &&
        maxScrollDepthRef.current < 10
      ) {
        return;
      }

      lastEngagementFlushRef.current = pageSessionKeyRef.current;

      void trackActivity("page_engagement", {
        fullPath: pageViewKeyRef.current,
        durationMs,
        exitReason,
        maxScrollDepth: maxScrollDepthRef.current,
        clickCount: clickCountRef.current,
        formSubmitCount: formSubmitCountRef.current,
        fieldChangeCount: fieldChangeCountRef.current,
        visibilityChangeCount: visibilityChangeCountRef.current,
        sectionNavigationCount: sectionNavigationCountRef.current,
      });
    },
    [user, trackActivity],
  );

  useEffect(() => {
    if (!user || !pathname) {
      pageViewKeyRef.current = null;
      pageSessionKeyRef.current = null;
      return;
    }

    const fullPath = getCurrentFullPath();

    if (sessionStartedForUserRef.current !== user.id) {
      sessionStartedForUserRef.current = user.id;
      void trackActivity("session_started", { entryPath: fullPath });
    }

    pageViewKeyRef.current = fullPath;
    pageSessionKeyRef.current = `${user.id}:${Date.now()}:${fullPath}`;
    resetPageMetrics();

    void trackActivity("page_view", {
      path: pathname,
      fullPath,
      hash: typeof window !== "undefined" ? window.location.hash || null : null,
      search:
        typeof window !== "undefined" ? window.location.search || null : null,
    });

    return () => {
      flushPageEngagement("route_change");
    };
  }, [pathname, trackActivity, user, flushPageEngagement]);

  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      const depth = getScrollDepth();
      if (depth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = depth;
      }

      SCROLL_MILESTONES.forEach((milestone) => {
        if (depth >= milestone && !scrollMilestonesRef.current.has(milestone)) {
          scrollMilestonesRef.current.add(milestone);
          void trackActivity("scroll_depth_reached", {
            fullPath: getCurrentFullPath(),
            milestone,
            depth,
          });
        }
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactiveElement = target.closest(INTERACTIVE_SELECTOR);
      if (!(interactiveElement instanceof HTMLElement)) return;

      clickCountRef.current += 1;
      void trackActivity("ui_click", {
        ...getElementMetadata(interactiveElement),
        fullPath: getCurrentFullPath(),
      });
    };

    const handleSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      formSubmitCountRef.current += 1;
      void trackActivity("form_submit", {
        ...getFormMetadata(form),
        fullPath: getCurrentFullPath(),
      });
    };

    const handleChange = (event: Event) => {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        )
      ) {
        return;
      }

      fieldChangeCountRef.current += 1;
      void trackActivity("form_field_changed", {
        ...getFieldMetadata(target),
        fullPath: getCurrentFullPath(),
      });
    };

    const handleVisibilityChange = () => {
      visibilityChangeCountRef.current += 1;
      void trackActivity("page_visibility_changed", {
        fullPath: getCurrentFullPath(),
        state: document.visibilityState,
      });
    };

    const handleHashChange = () => {
      sectionNavigationCountRef.current += 1;
      void trackActivity("section_navigation", {
        fullPath: getCurrentFullPath(),
        hash:
          typeof window !== "undefined" ? window.location.hash || null : null,
      });
    };

    const handlePageHide = () => {
      flushPageEngagement("page_hide");
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("change", handleChange, true);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("change", handleChange, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [trackActivity, user, flushPageEngagement]);

  return null;
};

export default AuthActivityTracker;
