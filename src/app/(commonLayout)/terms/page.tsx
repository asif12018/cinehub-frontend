import { FileText, Scale, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <section className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>By accessing or using the CineTube service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
            <p>We reserve the right to modify these terms at any time. We will provide notice of any material changes by posting the new Terms of Service on the site.</p>
          </div>
        </section>

        <section className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">2. Use of Service</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>CineTube grants you a limited, non-exclusive, non-transferable license to access the CineTube content for personal, non-commercial purposes only.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may not download, modify, copy, distribute, transmit, or display any part of the service or content.</li>
              <li>You must be at least 18 years old to create an account and subscribe to the service.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            </ul>
          </div>
        </section>

        <section className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">3. Subscription and Billing</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Your CineTube subscription will continue until terminated. To use the service, you must have Internet access and provide a current, valid, accepted method of payment.</p>
            <p>We may change our subscription plans and the price of our service from time to time; however, any price changes or changes to your subscription plans will apply no earlier than 30 days following notice to you.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
