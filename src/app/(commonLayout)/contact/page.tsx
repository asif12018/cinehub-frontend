"use client";

import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sendEmailAction } from "./actions";

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendEmailAction(formData);
    
    if (result.success) {
      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error || "Failed to send message. Please try again.");
    }
    
    setIsPending(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Get in Touch</h1>
        <p className="text-muted-foreground">Have a question, feedback, or need support? Our team is here to help you 24/7.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">Email Us</p>
                  <p className="text-muted-foreground text-sm mt-1">support@cinetube.com</p>
                  <p className="text-muted-foreground text-sm">press@cinetube.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">Call Us</p>
                  <p className="text-muted-foreground text-sm mt-1">+1 (800) 123-4567</p>
                  <p className="text-gray-500 text-xs mt-1">Mon-Fri from 8am to 5pm.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">Headquarters</p>
                  <p className="text-muted-foreground text-sm mt-1">123 Cinema Boulevard, Suite 400<br/>Los Angeles, CA 90028<br/>United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-black/5 dark:bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <input name="firstName" required type="text" className="w-full bg-black/5 dark:bg-black/40 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-red-500 transition-colors" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <input name="lastName" required type="text" className="w-full bg-black/5 dark:bg-black/40 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-red-500 transition-colors" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <input name="email" required type="email" className="w-full bg-black/5 dark:bg-black/40 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-red-500 transition-colors" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Subject</label>
              <select name="subject" required className="w-full bg-black/5 dark:bg-black/40 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-red-500 transition-colors appearance-none">
                <option>General Inquiry</option>
                <option>Billing & Subscriptions</option>
                <option>Technical Support</option>
                <option>Content Request</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <textarea name="message" required rows={4} className="w-full bg-black/5 dark:bg-black/40 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-red-500 transition-colors resize-y" placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" disabled={isPending} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6">
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} 
              {isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
