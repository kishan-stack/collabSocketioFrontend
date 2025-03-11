export function transformNeo4jData(responseData) {
    const transformedData = {};

    responseData.data.forEach((entry) => {
        const { user, relationship, connectedNode } = entry;

        // Use the user's unique ID (e.g., `kindeAuthId` or `userId`) as the key
        const userId = user.kindeAuthId;

        if (!transformedData[userId]) {
            transformedData[userId] = {
                userDetails: user, // Basic user details
                relationships: {
                    majoredIn: [],
                    location: null,
                    interests: [],
                    studiedIn: [],
                    academicYear: null,
                },
            };
        }

        // Group relationships based on their type
        switch (relationship) {
            case 'MAJORED_IN':
                transformedData[userId].relationships.majoredIn.push(connectedNode);
                break;

            case 'LOCATED_IN':
                transformedData[userId].relationships.location = connectedNode;
                break;

            case 'INTERESTED_IN':
                transformedData[userId].relationships.interests.push(connectedNode);
                break;

            case 'STUDIED_IN':
                transformedData[userId].relationships.studiedIn.push(connectedNode);
                break;

            case 'HAS_ACADEMIC_YEAR':
                transformedData[userId].relationships.academicYear = connectedNode;
                break;

            default:
                // Handle other relationships if needed
                break;
        }
    });

    // Return as an array for easier frontend consumption
    return Object.values(transformedData);
}
