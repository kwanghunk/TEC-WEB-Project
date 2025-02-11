import React from "react";

const SelectedFilters = ({ filters, onRemoveFilter }) => {
  return (
    <div>
      <h4>선택된 필터</h4>
      <ul>
        {filters.map((filter, index) => (
          <li key={index}>
            {filter}
            <button onClick={() => onRemoveFilter(filter)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedFilters;
