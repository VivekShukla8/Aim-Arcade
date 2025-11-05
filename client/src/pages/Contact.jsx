import TopNav from '../components/TopNav.jsx';
import { useState } from 'react';

export default function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  
  const mailto = () => {
    const to = 'vivekshukla8823@gmail.com';
    const subject = encodeURIComponent(`Contact from ${name||'Guest'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const whatsapp = () => {
    const to = '+919424938202';
    const text = encodeURIComponent(`Contact from ${name||'Guest'}: ${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `https://wa.me/${to}?text=${text}`;
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-wider mb-4">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Get in Touch
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Contact Us
              </h1>
              
              <p className="text-zinc-400 text-lg leading-relaxed">
                Have questions about tournaments, teams, or payments? We're here to help you compete at your best.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Email Card */}
              <a 
                href="mailto:vivekshukla8823@gmail.com"
                className="group block bg-gradient-to-br from-zinc-900/70 to-black/70 rounded-2xl p-6 border border-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Email</div>
                    <div className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">vivekshukla8823@gmail.com</div>
                    <div className="text-sm text-zinc-500 mt-1">Send us a message anytime</div>
                  </div>
                  <svg className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/919424938202"
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-gradient-to-br from-zinc-900/70 to-black/70 rounded-2xl p-6 border border-zinc-800/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">WhatsApp</div>
                    <div className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">+91 9424938202</div>
                    <div className="text-sm text-zinc-500 mt-1">Chat with us directly</div>
                  </div>
                  <svg className="w-5 h-5 text-zinc-600 group-hover:text-green-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl border border-zinc-800/50">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Support</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl border border-zinc-800/50">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">&lt;1h</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Response</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-zinc-900/50 to-black/50 rounded-xl border border-zinc-800/50">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">100%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Secure</div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 rounded-3xl p-8 border border-zinc-800/50 backdrop-blur-sm shadow-2xl">
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-black mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Send us a Message
                  </h3>
                  <p className="text-sm text-zinc-500">Fill out the form and we'll get back to you shortly</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Name
                    </label>
                    <input 
                      value={name} 
                      onChange={e=>setName(e.target.value)} 
                      placeholder="Enter your name" 
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Your Email
                    </label>
                    <input 
                      value={email} 
                      onChange={e=>setEmail(e.target.value)} 
                      placeholder="Enter your email" 
                      type="email"
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Your Message
                    </label>
                    <textarea 
                      value={message} 
                      onChange={e=>setMessage(e.target.value)} 
                      placeholder="Tell us how we can help..." 
                      rows={5} 
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={mailto} 
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl py-3 text-sm font-bold hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-[1.02]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </button>
                    
                    <button 
                      onClick={whatsapp}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 rounded-xl px-6 py-3 text-sm font-bold transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}