import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Form } from 'react-bootstrap';

import AutoComplete from '../AutoComplete/AutoComplete.component';
import useOutsideClick from '../../hooks/useOutsideClick';

type InputControlProps = {
    name: string,
    label: string,
    placeholder: string
}

const InputControl = ({ name, label, placeholder }: InputControlProps) => {
  const [documentRef, isVisible, setIsVisible] = useOutsideClick();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = _.debounce(processRequest, 300) as Function;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function processRequest(searchValue: string) {
    axios
      .get('/countries.json')
      .then((response) => {
        const countries = response.data as string[];
        const result = countries.filter((country) =>
          country.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSuggestions(result);
        if (result.length > 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
        setErrorMsg('');
      })
      .catch(() => setErrorMsg('Something went wrong. Try again later'));
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { value } = event.target;
    setSearchTerm(value);
    if (ref && ref.current) {
        ref.current(value);
    }
  }

  function handleSuggestionClick(countryValue: string) {
    setSelectedCountry(countryValue);
    setIsVisible(false);
  }

  return (
    <Form.Group controlId="searchTerm">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className="input-control"
        type="text"
        value={searchTerm}
        name={name}
        onChange={handleSearch}
        autoComplete="off"
        placeholder={placeholder}
      />
      <div ref={documentRef}>
        {isVisible && (
          <AutoComplete
            isVisible={isVisible}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
      {selectedCountry && (
        <div className="selected-country">
          Your selected country: {selectedCountry}
        </div>
      )}
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
    </Form.Group>
  );
};

export default InputControl;