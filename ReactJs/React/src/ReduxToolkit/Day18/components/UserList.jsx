import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/userSlice.js";
import "../styles/userList.css";

function UserList() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers()); // gọi giống hệt dispatch 1 action bình thường
  }, [dispatch]);

  if (status === "loading") return <p>LOADING...</p>;
  if (status === "failed") return <p>ERROR: {error}</p>;

  return (
    <ul>
      {items.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
