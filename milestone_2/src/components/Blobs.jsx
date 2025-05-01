'use client';

import { useEffect } from 'react';
import KUTE from 'kute.js';

export default function Blobs() {
  useEffect(() => {
    // Dark blob animation
    const darkBlobTween = KUTE.fromTo(
      '#blob1',
      { path: '#blob1' },
      { path: '#blob1-morph' },
      { repeat: Infinity, duration: 3000, yoyo: true }
    );

    // Light blob animation
    const lightBlobTween = KUTE.fromTo(
      '#blob2',
      { path: '#blob2' },
      { path: '#blob2-morph' },
      { repeat: Infinity, duration: 3000, yoyo: true, offset: 1500 } // Offset to create alternating effect
    );

    darkBlobTween.start();
    lightBlobTween.start();

    return () => {
      darkBlobTween.stop();
      lightBlobTween.stop();
    };
  }, []);

  return (
    <div className="w-[430px] h-[446px] relative mx-auto">
      {/* Dark blob */}
      <div className="absolute left-0 top-0 w-full h-full z-0">
        <svg className="w-full h-full" viewBox="0 0 630 646" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="blob1" d="M479.847 101.163C532.67 143.447 587.13 178.222 612.518 228.408C637.906 278.595 634.63 343.403 609.242 396.356C583.445 449.309 535.945 489.616 484.76 535.061C433.985 580.505 379.115 630.692 315.645 642.942C251.767 655.193 178.47 629.507 120.324 586.038C62.1776 542.964 18.3633 482.503 4.85049 418.485C-8.66234 354.468 7.71684 286.498 33.5141 225.247C59.7207 163.996 95.3455 109.462 145.302 66.7837C195.258 23.7101 259.956 -7.5084 318.102 1.58052C375.839 10.2743 427.024 59.2754 479.847 101.163Z" fill="#2A5F74" fillOpacity="0.83" />
          <path id="blob1-morph" d="M479.847 544.837C532.67 502.553 587.13 467.778 612.518 417.592C637.906 367.405 634.63 302.597 609.242 249.644C583.445 196.691 535.945 156.384 484.76 110.939C433.985 65.495 379.115 15.308 315.645 3.058C251.767 -9.193 178.47 16.493 120.324 59.962C62.1776 103.036 18.3633 163.497 4.85049 227.515C-8.66234 291.532 7.71684 359.502 33.5141 420.753C59.7207 482.004 95.3455 536.538 145.302 579.216C195.258 622.29 259.956 653.508 318.102 644.419C375.839 635.726 427.024 586.725 479.847 544.837Z" fill="#2A5F74" fillOpacity="0" />
        </svg>
      </div>
      {/* Light blob */}
      <div className="absolute left-0 top-0 w-[391px] h-[432px] z-10">
        <svg className="w-full h-full" viewBox="0 0 591 632" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="blob2" d="M519.805 70.953C587.705 143.371 608.389 280.217 576.014 389.593C543.188 498.97 457.302 580.378 366.919 613.84C276.986 647.302 182.556 632.818 120.502 584.373C58.4484 535.928 28.3208 453.021 11.6831 367.618C-4.50484 282.714 -8.10215 195.812 28.7704 130.885C65.643 66.458 142.986 24.5054 239.664 7.52459C335.892 -9.45623 451.456 -1.46525 519.805 70.953Z" fill="#D9F0F4" fillOpacity="0.71" />
          <path id="blob2-morph" d="M71.195 561.047C3.29501 488.629 -17.389 351.783 14.986 242.407C47.812 133.03 133.698 51.622 224.081 18.16C314.014 -15.302 408.444 -0.818 470.498 47.627C532.552 96.072 562.679 178.979 579.317 264.382C595.505 349.286 599.102 436.188 562.23 501.115C525.357 565.542 448.014 607.495 351.336 624.475C255.108 641.456 139.544 633.465 71.195 561.047Z" fill="#D9F0F4" fillOpacity="0" />
        </svg>
      </div>
      {/* User token overlay */}
      <div className="absolute left-[50px] top-[50px] w-[300px] h-[300px] z-20">
        <img src="/images/chosen_user-token.svg" alt="User Token" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}