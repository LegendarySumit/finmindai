import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CookiePolicy() {
  return (
    <div className="bg-finance-darker min-h-screen">
      <Header />
      <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-12 md:pb-16 lg:pb-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">Cookie Policy</h1>
        
        <div className="text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They help websites remember information about your visit, making your online experience easier and more personalized.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">2. Types of Cookies We Use</h2>
            <p>We may use the following types of cookies on our website:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly.</li>
              <li><strong>Analytics Cookies:</strong> These help us understand how visitors use our website.</li>
              <li><strong>Preference Cookies:</strong> These remember your choices and settings.</li>
              <li><strong>Marketing Cookies:</strong> These track your activity to show relevant advertisements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">3. How We Use Cookies</h2>
            <p>
              Cookies help us to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Remember your login information</li>
              <li>Understand how you use our website</li>
              <li>Personalize your experience</li>
              <li>Improve our services and website performance</li>
              <li>Deliver targeted advertising</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">4. Third-Party Cookies</h2>
            <p>
              Some cookies may be placed by third-party services that we use, such as analytics providers and advertising partners. These third parties have their own cookie policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">5. Managing Your Cookie Preferences</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>View what cookies have been set</li>
              <li>Delete stored cookies</li>
              <li>Prevent cookies from being set</li>
            </ul>
            <p className="mt-4">
              However, disabling cookies may affect the functionality and user experience on our website. Some features may not work properly if cookies are disabled.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">6. Changes to This Policy</h2>
            <p>
              FinMindAI may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically to stay informed about how we use cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> hello@finmindai.com<br />
              <strong>Address:</strong> San Francisco, CA<br />
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
