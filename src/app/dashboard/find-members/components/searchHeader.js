import SearchBar from "../../../../components/SearchBar";
import { Input } from "../../../../components/ui/input";
export default function SearchHeader() {
  return (
    <header className="px-4">
      <Input placeholder="Search members..." className="w-full md:w-full lg:w-2/3" aria-label="Search members" />
      <SearchBar />
    </header>
  );
}
