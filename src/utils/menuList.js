export const menuList = [
  {
    id: 0,
    name: "Dashboard",
    path: "/dashboard",
    icon: "feather-layout",
    allowedRoles: ["ADMIN", "COACH"],
  },
  {
    id: 1,
    name: "Players",
    path: "/Player-managment",
    icon: "feather-users",
    allowedRoles: ["ADMIN", "COACH"],
  },
  {
    id: 2,
    name: "Teams",
    path: "/coach/teams/",
    icon: "feather-user-plus",
    allowedRoles: ["ADMIN", "COACH"],
  },
  {
    id: 3,
    name: "Coaches",
    path: "/coaches",
    icon: "feather-user",
    allowedRoles: ["ADMIN"], // only admin
  },
 
];
