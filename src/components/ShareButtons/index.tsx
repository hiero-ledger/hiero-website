"use client";

import React from "react";

export default function ShareButtons() {
  // Guard for SSR (even though "use client" ensures client-side)
  if (typeof window === "undefined") {
    return null;
  }

  const shareUrl = window.location.href;
  const shareTitle = document.title;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const networks = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      bg: "bg-[#0077b5] hover:bg-[#046293]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      bg: "bg-[#54A9EB] hover:bg-[#4B97D1]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M22.5.75L1.5 9.3c-.9.36-.89 1.64.02 1.98l5.3 2.02 2.03 6.4c.27.85 1.33 1.08 1.9.42l2.9-3.2 5.37 3.9c.7.5 1.7.12 1.9-.73l3.6-18.1c.2-.95-.7-1.7-1.6-1.24z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      bg: "bg-black hover:bg-zinc-900",
      icon: (
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
          <path d="M17.9686 14.1623L26.7065 4H24.6358L17.0488 12.8238L10.9891 4H4L13.1634 17.3432L4 28H6.07069L14.0827 18.6817L20.4822 28H27.4714L17.9681 14.1623H17.9686Z" />
        </svg>
      ),
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      bg: "bg-[#777777] hover:bg-[#5e5e5e]",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M22 4H2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.05-.17.07-.27.07zm4.75-1.07c-.24-.14-.32-.44-.18-.68.14-.24.45-.32.68-.18l3.5 2c.24.14.32.44.18.68-.09.15-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {networks.map(n => (
        <a
          key={n.name}
          href={n.href}
          target={n.name === "Email" ? undefined : "_blank"}
          rel={n.name === "Email" ? undefined : "noopener noreferrer"}
          aria-label={`Share on ${n.name}`}
          className={`flex items-center justify-center w-10 h-10 rounded-[5px] transition-all duration-200 shadow-sm ${n.bg}`}>
          {n.icon}
        </a>
      ))}
    </div>
  );
}
