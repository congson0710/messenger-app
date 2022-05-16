import { useEffect, useRef, useState, useCallback } from "react";

const useScroll = ({
  onLoadMore,
}: {
  onLoadMore: () => void;
}): {
  containerCallbackRef: (el: HTMLElement | null) => void;
  sentryCallbackRef: (el: HTMLElement | null) => void;
} => {
  const containerRef = useRef<HTMLElement | null>(null);
  const sentryRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const id = setTimeout(onLoadMore, 50);

      return () => clearTimeout(id);
    }
  }, [visible, onLoadMore]);

  // unobserve the el
  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = null;
    setVisible(false);
  }, []);

  // initialize new observer & observe the sentry el
  const observe = useCallback(() => {
    if (sentryRef.current) {
      const options = {
        root: containerRef.current,
        rootMargin: "0px",
        threshold: 0,
      };
      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }, options);
      observerRef.current = observer;

      observer.observe(sentryRef.current);
    }
  }, []);

  // callback refs
  const containerCallbackRef = useCallback(
    (el: HTMLElement | null) => {
      containerRef.current = el;
      unobserve();
      observe();
    },
    [observe, unobserve]
  );

  const sentryCallbackRef = useCallback(
    (el: HTMLElement | null) => {
      sentryRef.current = el;
      unobserve();
      observe();
    },
    [observe, unobserve]
  );

  return {
    containerCallbackRef,
    sentryCallbackRef,
  };
};

export default useScroll;
