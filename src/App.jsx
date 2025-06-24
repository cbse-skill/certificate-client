import { useContext } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoadingContext } from './components/common/context/LoaderContext.jsx';
import Layout from "./components/common/layout/Layout.jsx";
import Loader from './components/common/loader/Loader';
import ListOfCertificateTemplate from './pages/ListOfCertificateTemplate/ListOfCertificateTemplate.jsx';
import ListOfParicipant from "./pages/ListOfParicipant/ListOfParicipant.jsx";
import HomePageContainer from "./pages/home/HomePageContainer.jsx";

export default function App() {
  const { loading } = useContext(LoadingContext);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePageContainer />
        }]
    },
    {
      path: "/certificate",
      element: <Layout />,
      children: [
        {
          index: true,
          path: "templates",
          element: <ListOfCertificateTemplate />
        },
        {
          index: true,
          path: "participants",
          element: <ListOfParicipant />
        }
      ]
    }]);
  return (
    <>
      {loading && <Loader />}
      <RouterProvider router={router} />
      {/* <Header /> */}
      {/* <ListOfCertificateTemplate /> */}
    </>
  );
}
