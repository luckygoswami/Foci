import { toTitleCase } from '@/lib/utils';
import { useRef, useState } from 'react';

function SnapSections({
  sections,
}: {
  sections: { title: string; component: React.ComponentType<any> }[];
}) {
  const titles = sections.map((section) => section.title);
  const components = sections.map((section) => section.component);
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
    <div className="flex-[1] flex flex-col border-x border-t rounded-tr-2xl rounded-tl-2xl px-2 border-black overflow-hidden">
      {/* Navigation Tabs with Active State */}
      <div className="flex border-b">
        {titles.map((title, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            role="tab"
            aria-selected={activeTab === i}
            tabIndex={activeTab === i ? 0 : -1}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === i
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}>
            {toTitleCase(title)}
          </button>
        ))}
      </div>

      {/* Scrollable Sections */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex space-x-4 overflow-x-auto snap-x snap-mandatory overflow-y-hidden scroll-smooth no-scrollbar flex-[1]">
        {components.map((Comp, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full snap-center overflow-y-auto">
            <Comp />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SnapSections;
