import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
export const renderSection = (section, sectionName, sectionIcon) => (
    <Card className="w-full mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-700 to-black text-white rounded-t-md">
            <div className="flex items-center space-x-2">
                <span className="text-2xl">{sectionIcon}</span>
                <h3 className="text-xl font-semibold">{sectionName}</h3>
            </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-md p-4 relative w-fit">
            {section.length > 0 ? (
                section.map((item, index) => (
                    <div key={index} className="relative grid gap-4 mb-4 border rounded-md p-4 shadow-sm">
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <p>{item.description}</p>
                        <p className="text-sm text-gray-500">{item.additionalInfo}</p>
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500">
                    <p>No {sectionName} added yet.</p>
                </div>
            )}

            <Button
                variant="outline"

                className="mt-4 py-2 px-6 text-white hover:text-indigo-600 hover:bg-gray-100 bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
            >
                Add {sectionName}
            </Button>
        </CardContent>
    </Card>
);