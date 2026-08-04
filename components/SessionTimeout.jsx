"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SessionTimeout({ timeoutMinutes = 30 }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
      return;
    }

    // Update last activity timestamp on user interaction
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Check for inactivity every minute
    timeoutRef.current = setInterval(async () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      const timeoutMs = timeoutMinutes * 60 * 1000;

      if (timeSinceLastActivity >= timeoutMs) {
        clearInterval(timeoutRef.current);
        await supabase.auth.signOut();
        router.push("/auth/login?message=Session expired due to inactivity");
      }
    }, 60000); // Check every 60 seconds

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [session, pathname, timeoutMinutes, router]);

  return null;
}
