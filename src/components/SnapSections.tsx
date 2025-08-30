import { toTitleCase } from '@/lib/utils';
import { useRef, useState } from 'react';

export function SnapSections({
  sections,
}: {
  sections: {
    title: string;
    component: React.ComponentType<any>;
    props?: Record<string, any>;
  }[];
}) {
  const titles = sections.map((section) => section.title);
  const components = sections.map((section) => {
    return { component: section.component, props: section.props };
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const scrollToSection = (sectionIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sectionWidth = container.offsetWidth;
    container.scrollTo({
      left: sectionWidth * sectionIndex,
      behavior: 'smooth',
    });
  };
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const newActiveTab = Math.round(scrollPosition / containerWidth);

    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
    }
  };

  return (
    <div className="flex-[1] flex flex-col overflow-hidden items-">
      {/* Navigation Tabs with Active State */}
      <div className=" flex justify-around my-3">
        {/* TODO: Add expandable search button here */}
        <div className="rounded-full bg-[#fafafa] shadow-sm">
          {titles.map((title, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              role="tab"
              aria-selected={activeTab === i}
              tabIndex={activeTab === i ? 0 : -1}
              className={`font-medium px-8 py-3  ${
                activeTab === i
                  ? 'text-card bg-primary rounded-full'
                  : 'text-muted-foreground hover:text-blue-600'
              }`}>
              {toTitleCase(title)}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Sections */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="border-t-2 border-border/20 flex space-x-4 overflow-x-auto snap-x snap-mandatory overflow-y-hidden scroll-smooth no-scrollbar flex-[1]">
        {components.map(({ component: Comp, props }, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full snap-center overflow-y-auto px-5 py-2">
            <Comp {...(props || {})} />
          </div>
        ))}
      </div>
    </div>
  );
}
