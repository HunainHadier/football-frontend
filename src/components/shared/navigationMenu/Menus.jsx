import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { menuList } from "@/utils/menuList";

const Menus = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubDropdown, setOpenSubDropdown] = useState(null);
  const [activeParent, setActiveParent] = useState("");
  const [activeChild, setActiveChild] = useState("");
  const { pathname } = useLocation();

  // Convert role to lowercase to match allowedRoles
  const rawRole = localStorage.getItem("role");
  const userRole = rawRole ? rawRole.toLowerCase() : null; 
  // Example: "COACH" → "coach"

  // MAIN MENU FILTER (role based)
  const filteredMenu = menuList.filter((menu) => {
    if (!menu.allowedRoles) return true; // no restriction
    return menu.allowedRoles.map(r => r.toLowerCase()).includes(userRole);
  });

  const handleMainMenu = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    if (pathname !== "/") {
      const parts = pathname.split("/");
      setActiveParent(parts[1] || "");
      setActiveChild(parts[2] || "");
      setOpenDropdown(parts[1] || "");
    }
  }, [pathname]);

  return (
    <>
      {filteredMenu.map(({ dropdownMenu, id, name, path }) => {
        const filteredDropdown =
          dropdownMenu?.filter((item) =>
            !item.allowedRoles
              ? true
              : item.allowedRoles.map((r) => r.toLowerCase()).includes(userRole)
          ) || [];

        return (
          <li
            key={id}
            onClick={() => handleMainMenu(name)}
            className={`nxl-item nxl-hasmenu ${
              activeParent === name ? "active nxl-trigger" : ""
            }`}
          >
            <Link to={path} className="nxl-link text-capitalize">
              <span className="nxl-mtext pl-1">{name}</span>
              <span className="nxl-arrow fs-16">
                <FiChevronRight />
              </span>
            </Link>

            {filteredDropdown.length > 0 && (
              <ul
                className={`nxl-submenu ${
                  openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"
                }`}
              >
                {filteredDropdown.map(({ id, name, path }) => (
                  <Fragment key={id}>
                    <li
                      className={`nxl-item ${
                        pathname === path ? "active" : ""
                      }`}
                    >
                      <Link className="nxl-link text-capitalize" to={path}>
                        {name}
                      </Link>
                    </li>
                  </Fragment>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </>
  );
};

export default Menus;
