import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="bg-finance-darker min-h-screen">
      <Header />
      <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-12 md:pb-16 lg:pb-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8">Privacy Policy</h1>
        
        <div className="text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">1. Introduction</h2>
            <p>
              FinMindAI (we, us, our, or Company) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Personal Data:</strong> Email address, name, phone number, and other information you voluntarily provide.</li>
              <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, and referring URLs.</li>
              <li><strong>Financial Data:</strong> Financial information, such as data related to your payment method that we may collect when you purchase services from the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Generate analytics about how you use our Site</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site</li>
              <li>Improve the Site and enhance user experience</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Notify you of updates to the Site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">4. Disclosure of Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>By law or to protect rights</li>
              <li>Third-party service providers</li>
              <li>Sale or bankruptcy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-finance-gold mb-4">6. Contact Us</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
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
