import React from 'react';

type AutoCompleteProps = {
    isVisible: boolean,
    suggestions: string[],
    handleSuggestionClick: Function,
}

function AutoComplete({ isVisible, suggestions, handleSuggestionClick }: AutoCompleteProps) {
  return (
    <div className={`${isVisible ? 'show suggestion-box' : 'suggestion-box'}`}>
      <ul>
        {suggestions.map((country, index) => (
          <li key={index} onClick={() => handleSuggestionClick(country)}>
            {country}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AutoComplete;