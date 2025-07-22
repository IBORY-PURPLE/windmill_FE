import PersonalNavigation from "../components/PersonalNavigation";
import { Outlet, useNavigation } from "react-router-dom";

function PersonalRoot() {
  const navigation = useNavigation();
  return (
    <>
      <PersonalNavigation />
      <main>
        {navigation.state === "loading" ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-xl font-semibold text-gray-600">Loading...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}

export default PersonalRoot;

// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const page = parseInt(url.searchParams.get("page") || "1", 10);
//   const size = 50;

//   const response = await fetch(
//     `https://windmill-be-iqxx.onrender.com/stock?page=${page}&size=${size}`
//   );

//   if (!response.ok) {
//     throw json(
//       { message: "주식 데이터를 불러오지 못했습니다." },
//       { status: 500 }
//     );
//   }

//   const stocks = await response.json();
//   console.log(stocks);
//   const totalItems = stocks.data.length;
//   const totalPages = Math.ceil(totalItems / size);

//   const paginatedData = stocks.data.slice((page - 1) * size, page * size);

//   return {
//     stocks: paginatedData,
//     totalPages: totalPages,
//     page,
//   };
// }
