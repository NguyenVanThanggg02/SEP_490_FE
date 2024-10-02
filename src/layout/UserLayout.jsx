import React from "react";

const UserLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>User Profile</h1>
      </header>
      <main>{children}</main>
      <footer>© 2024 User</footer>
    </div>
  );
};

export default UserLayout;
