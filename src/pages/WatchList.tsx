import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { WatchListHeader } from "@/components/watch-list/WatchListHeader";
import { WatchListTable } from "@/components/watch-list/WatchListTable";

const WatchList = () => {
  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel title="Watch List" />
      <div className="pt-16">
        <WatchListHeader />
        <WatchListTable />
      </div>
    </div>
  );
};

export default WatchList;