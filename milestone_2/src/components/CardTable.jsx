"use client";
import SearchBar from './SearchBar';
import Filter from './Filter';

export default function CardTable({
  title = "",
  data = [],
  filterFunction,
  emptyMessage = "No items found",
  searchConfig = {},
  filterConfig = {},
  renderCard,
  renderContainer,
  customSearchBar = null
}) {
  const { 
    searchTerm = '', 
    onSearchChange,
    placeholder = "Search...",
    hideSearchBar = false
  } = searchConfig;

  const { 
    showFilter = false,
    filterOptions = [],
    selectedFilter = '',
    onFilterChange,
    filterLabel = "Filter" 
  } = filterConfig;

  const filteredData = data.filter(item => 
    filterFunction(item, searchTerm, selectedFilter)
  );

  const Container = renderContainer
    ? ({ children }) => renderContainer({ children })
    : ({ children }) => <div className="w-full space-y-3">{children}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        {/* Title Section */}
        {title && (
          <h1 className="text-3xl font-bold mb-6 text-left text-[#2a5f74] relative">
            {title}
            <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#2a5f74]"></span>
          </h1>
        )}

        {/* Search and Filter Row */}
        {!hideSearchBar && (
          <div className="w-full mb-4">
            {customSearchBar ? (
              customSearchBar
            ) : (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 w-full">
                <div className="flex-1">
                  <SearchBar 
                    searchTerm={searchTerm} 
                    setSearchTerm={onSearchChange} 
                    placeholder={placeholder}
                  />
                </div>
                {showFilter && (
                  <div className="flex-1">
                    <Filter 
                      options={filterOptions}
                      selectedValue={selectedFilter}
                      onChange={onFilterChange}
                      label={filterLabel}
                      placeholder="Select an option"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cards Section */}
      <Container>
        {filteredData.map((item) => renderCard(item))}
        
        {filteredData.length === 0 && (
          <div className="p-2 text-center text-gray-500">
            {typeof emptyMessage === 'function' 
              ? emptyMessage(searchTerm)
              : emptyMessage.replace(/{searchTerm}/g, searchTerm)
            }
          </div>
        )}
      </Container>
    </div>
  );
}