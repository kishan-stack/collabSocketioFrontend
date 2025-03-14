// TagSelector.js
import React, { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { debounce } from "lodash";
import useApiRequest from "@/hooks/apihooks/useApiRequest";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
const TagSelector = ({ onTagsSelected, instanceId }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const { sendRequest } = useApiRequest();
    const cache = {}; // Cache for storing already fetched data
    const { getToken } = useKindeAuth();

    const fetchTagsDebounced = useCallback(
        debounce(async (inputValue, callback) => {
            if (cache[inputValue]) {
                callback(cache[inputValue]);
                return;
            }

            try {
                // Fetch data from your backend
                const token = await getToken();
                if (token) {
                    const response = await sendRequest(
                        `/users/getTags`,
                        'GET',
                        null, // no request body
                        { query: inputValue } // query parameters
                    );
                    const transformedData = response.data.map((tag) => ({
                        label: tag.name,
                        value: tag.name,
                    }));

                    cache[inputValue] = transformedData;
                    callback(transformedData);
                }
            } catch (error) {
                console.error(
                    "Error fetching tags:",
                    error.response || error.message
                );
                callback([]);
            }
        }, 300),
        []
    );

    const loadOptions = (inputValue, callback) => {
        if (!inputValue) {
            callback([]);
            return;
        }
        fetchTagsDebounced(inputValue, callback);
    };

    const handleChange = (selectedOptions) => {
        setSelectedTags(selectedOptions || []);
        if (onTagsSelected) {
            onTagsSelected(selectedOptions.map((option) => option.value));
        }
    };

    return (
        <AsyncSelect
            isMulti
            cacheOptions
            loadOptions={loadOptions}
            onChange={handleChange}
            instanceId={instanceId}
            placeholder="Search and select tags..."
        />
    );
};

export default TagSelector;
