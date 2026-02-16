import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../../components/Loader";
import { useStatsQuery } from "../../redux/api/dashboardApi";
import { RootState } from "../../redux/store";
import { getLastMonths } from "../../utils/features";

const userImg = "../../assets/userIcon.png";

const { last6Months } = getLastMonths();

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError } = useStatsQuery(user?._id!);

  const stats = data?.stats!;

  if (isError) return <Navigate to={"/"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? (
          <Skeleton
            length={10}
            flex="flex flex-col gap-2"
            className="skeleton w-full h-[3rem]"
          />
        ) : (
          <>
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={user?.photo || userImg} alt="User" />
            </div>

            <section className="widget-container">
              <WidgetItem
                percent={stats.changePercent.revenue}
                amount={true}
                value={stats?.count.revenue}
                heading="Revenue"
                color="rgb(0, 115, 255)"
              />
              <WidgetItem
                percent={stats.changePercent.user}
                value={stats.count.users}
                color="rgb(0 198 202)"
                heading="Users"
              />
              <WidgetItem
                percent={stats.changePercent.order}
                value={stats.count.orders}
                color="rgb(255 196 0)"
                heading="Transactions"
              />

              <WidgetItem
                percent={stats.changePercent.product}
                value={stats.count.products}
                color="rgb(76 0 255)"
                heading="Products"
              />
            </section>

            <section className="graph-container">
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>
                <BarChart
                  data_1={stats.chart.revenue}
                  data_2={stats.chart.order}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0, 115, 255)"
                  bgColor_2="rgba(53, 162, 235, 0.8)"
                  labels={last6Months}
                />
              </div>

              <div className="dashboard-categories">
                <h2>Inventory</h2>

                <div>
                  {stats.categoriesCountData.map((i) => {
                    const [heading, value] = Object.entries(i)[0];
                    return (
                      <>
                        <CategoryItem
                          key={i.heading}
                          value={value}
                          heading={heading}
                          color={`hsl(${
                            value * Math.random() * 4
                          }, ${value}10%, 40%)`}
                        />
                      </>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="transaction-container">
              <div className="gender-chart">
                <h2>Gender Ratio</h2>
                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[stats.userRatio.female, stats.userRatio.male]}
                  backgroundColor={[
                    "hsl(340, 82%, 56%)",
                    "rgba(53, 162, 235, 0.8)",
                  ]}
                  cutout={90}
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>
              <Table
                data={stats.latestTransactions.map((transaction) => ({
                  ...transaction,
                  amount: transaction.total || 0, // Provide a default value if amount is missing
                }))}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}`}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {`${percent < -10000 ? 9999 : percent}`}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle text-[12px]"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent > 0 && `${percent > 10000 ? 9999 : percent}`}%
        {percent < 0 && `${percent < -10000 ? -9999 : percent}`}%
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5 className="text-[12px]">{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
