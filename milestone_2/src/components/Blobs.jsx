'use client';

export default function Blobs() {
  return (
    <div className="w-[430px] h-[446px] relative mx-auto">
      {/* Dark blob */}
      <div className="absolute left-0 top-0 w-full h-full z-0">
        <svg className="w-full h-full" viewBox="0 0 630 646" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="blob1" d="M479.847 101.163C532.67 143.447 587.13 178.222 612.518 228.408C637.906 278.595 634.63 343.403 609.242 396.356C583.445 449.309 535.945 489.616 484.76 535.061C433.985 580.505 379.115 630.692 315.645 642.942C251.767 655.193 178.47 629.507 120.324 586.038C62.1776 542.964 18.3633 482.503 4.85049 418.485C-8.66234 354.468 7.71684 286.498 33.5141 225.247C59.7207 163.996 95.3455 109.462 145.302 66.7837C195.258 23.7101 259.956 -7.5084 318.102 1.58052C375.839 10.2743 427.024 59.2754 479.847 101.163Z" fill="#2A5F74" fillOpacity="0.83" />
        </svg>
      </div>
      {/* Light blob */}
      <div className="absolute left-0 top-0 w-[391px] h-[432px] z-10">
        <svg className="w-full h-full" viewBox="0 0 591 632" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="blob2" d="M519.805 70.953C587.705 143.371 608.389 280.217 576.014 389.593C543.188 498.97 457.302 580.378 366.919 613.84C276.986 647.302 182.556 632.818 120.502 584.373C58.4484 535.928 28.3208 453.021 11.6831 367.618C-4.50484 282.714 -8.10215 195.812 28.7704 130.885C65.643 66.458 142.986 24.5054 239.664 7.52459C335.892 -9.45623 451.456 -1.46525 519.805 70.953Z" fill="#D9F0F4" fillOpacity="0.71" />
        </svg>
      </div>
      {/* User token overlay */}
      <div className="absolute left-[50px] top-[50px] w-[300px] h-[300px] z-20">
        <img src="/images/chosen_user-token.svg" alt="User Token" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}