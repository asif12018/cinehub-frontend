import { Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <section className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">1. Information We Collect</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>At CineTube, we are committed to protecting your privacy. We collect information you provide directly to us when you create an account, subscribe to our service, or communicate with us.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, payment information, and phone number.</li>
              <li><strong>Usage Data:</strong> Viewing history, search queries, interactions with our content, and device information.</li>
            </ul>
          </div>
        </section>

        <section className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>We use the information we collect to deliver and improve our services, personalize your experience, and communicate with you.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, maintain, and improve our streaming services.</li>
              <li>To process your payments and manage your subscription.</li>
              <li>To send you technical notices, updates, security alerts, and support messages.</li>
              <li>To recommend content we think you will enjoy.</li>
            </ul>
          </div>
        </section>

        <section className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">3. Data Security</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure or access.</p>
            <p>However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
