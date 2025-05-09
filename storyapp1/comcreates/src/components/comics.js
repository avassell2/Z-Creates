import Comic from "./comic";
import "./comic.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";

const Comics = ({userId}) => {
  const { isLoading, error, data } = useQuery(["series"], () =>
    makeRequest.get("/series?userId="+userId).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((comic) => <Comic comic={comic} key={comic.id} />)}
    </div>
  );
};

export default Comics;