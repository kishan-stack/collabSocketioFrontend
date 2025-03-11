// TagSelector.js
import React, { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { debounce } from "lodash";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
const TagSelector = ({ onTagsSelected, instanceId }) => {
    const [selectedTags, setSelectedTags] = useState([]);
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
                const response = await axios.get(
                    "http://localhost:5000/api/v1/users/getTags",
                    {
                        params: {
                            query: inputValue, // Pass inputValue as the query
                        },
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const transformedData = response.data.map((tag) => ({
                    label: tag.name,
                    value: tag.name,
                }));

                cache[inputValue] = transformedData;
                callback(transformedData);
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
