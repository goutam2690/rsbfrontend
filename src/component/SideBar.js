import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaKey } from "react-icons/fa";
import { FaBookMedical } from "react-icons/fa6";
import { useEffect } from 'react';
import { BsGraphUpArrow } from "react-icons/bs";
import { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import { AuthContext } from '../AuthContext';
import TopBar from "./TopBar";
import { IoSettings } from "react-icons/io5";
const accountroutes = [

  {
    path: "/rqlist",
    name: "Requisition",
    icon: <FaBookMedical />,
  },
]
const productionroutes = [

  {
    path: "/rqlist",
    name: "Requisition",
    icon: <FaBookMedical />,
  },
]
const staffroutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <FaHome />,
  },

  {
    path: "/requisition",
    name: "Requisition ",
    icon: <FaBookMedical />,
  },
  {
    path: "/notation",
    name: "Notation ",
    icon: <FaBookMedical />,
  },
]
const adminroutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <FaHome />,
  },
  {
    path: "/master-file",
    name: "Master",
    icon: <FaKey />,
    subRoutes: [
        {
          path: "/Category",
          name: "Item Category ",
          icon: <FaBookMedical />,
        },  
        {
          path: "/family",
          name: "Item Family ",
          icon: <FaBookMedical />,
        },
        {
          path: "/types",
          name: "Item Types",
          icon: <FaBookMedical />,
        },
        {
          path: "/subtype1",
          name: "Item Sub Types 1",
          icon: <FaBookMedical />,
        },
        {
          path: "/subtype2",
          name: "Item Sub Types 2",
          icon: <FaBookMedical />,
        },
        {
          path: "/moc",
          name: "Meterial of Construction",
          icon: <FaBookMedical />,
        },
        {
          path: "/mg",
          name: "Meterial of grade",
          icon: <FaBookMedical />,
        },
        {
          path: "/specification",
          name: "Specification",
          icon: <FaBookMedical />,
        },
        {
          path: "/process",
          name: "Process",
          icon: <FaBookMedical />,
        },
        {
          path: "/stage",
          name: "Stages",
          icon: <FaBookMedical />,
        },
        {
          path: "/supplytype",
          name: "Supply Type",
          icon: <FaBookMedical />,
        },
        {
          path: "/itemmake",
          name: "Item Make",
          icon: <FaBookMedical />,
        },
        {
          path: "/otherdetails",
          name: "Other Details",
          icon: <FaBookMedical />,
        },
        {
            path: "/dimension",
            name: "Dimension",
            icon: <FaBookMedical />,
          },
          {
            path: "/stockingtype",
            name: "Stocking Type",
            icon: <FaBookMedical />,
          },
          {
            path: "/linetype",
            name: "Line Type",
            icon: <FaBookMedical />,
          },
          {
            path: "/uom",
            name: "UOM",
            icon: <FaBookMedical />,
          },
          {
            path: "/glclass",
            name: "GL Class",
            icon: <FaBookMedical />,
          },
          {
            path: "/hsn",
            name: "HSN Code",
            icon: <FaBookMedical />,
          },
          {
            path: "/cmc/",
            name: "Commodity Class",
            icon: <FaBookMedical />,
          },
          {
            path: "/scm/",
            name: "Commodity Sub Class",
            icon: <FaBookMedical />,
          },
      ],
  },
  {
    path: "/rqlist",
    name: "Requisition",
    icon: <BsGraphUpArrow />,
  },
  {
    path: "/report",
    name: "Report",
    icon: <BsGraphUpArrow />,
  },
  {
    path: "/notation",
    name: "Notation ",
    icon: <FaBookMedical />,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <IoSettings />
    ,
  },
  // {
  //   path: "/file-manager",
  //   name: "File Manager",
  //   icon: <AiTwotoneFileExclamation />,
  //   subRoutes: [
  //     {
  //       path: "/settings/profile",
  //       name: "Profile ",
  //       icon: <FaUser />,
  //     },
  //     {
  //       path: "/settings/2fa",
  //       name: "2FA",
  //       icon: <FaLock />,
  //     },
  //     {
  //       path: "/settings/billing",
  //       name: "Billing",
  //       icon: <FaMoneyBill />,
  //     },
  //   ],
  // },
  // {
  //   path: "/order",
  //   name: "Order",
  //   icon: <BsCartCheck />,
  // },
  // {
  //   path: "/settings",
  //   name: "Settings",
  //   icon: <BiCog />,
  //   exact: true,
  //   subRoutes: [
  //     {
  //       path: "/settings/profile",
  //       name: "Profile ",
  //       icon: <FaUser />,
  //     },
  //     {
  //       path: "/settings/2fa",
  //       name: "2FA",
  //       icon: <FaLock />,
  //     },
  //     {
  //       path: "/settings/billing",
  //       name: "Billing",
  //       icon: <FaMoneyBill />,
  //     },
  //   ],
  // },
  // {
  //   path: "/saved",
  //   name: "Saved",
  //   icon: <AiFillHeart />,
  // },
];

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const {user } = useContext(AuthContext);
  const [routes,setRoutes] = useState([])
 
//   const inputAnimation = {
//     hidden: {
//       width: 0,
//       padding: 0,
//       transition: {
//         duration: 0.2,
//       },
//     },
//     show: {
//       width: "140px",
//       padding: "5px 15px",
//       transition: {
//         duration: 0.2,
//       },
//     },
//   };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };
  useEffect(() => {

    const renderroute = ()=>{
      if(user){

        if(user.is_superuser){
          setRoutes(adminroutes)
        }
        else if(user.groups){
          if(user.groups[0] ===  "accounts"){
            setRoutes(accountroutes)
          }
          else if(user.groups[0] === "operation"){
            setRoutes(productionroutes)
          }
          else if(user.groups[0] === "user"){
            setRoutes(staffroutes)
          }
        }
       
      }
    }

    // Check if the window width is less than a certain value to determine if it's a mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600); // You can adjust the threshold value
    };

    // Initial check on mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    renderroute()
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [user]);


  return (
    <>
      <div className="main-container " key="main-container">
    {/* isMobile?(isOpen?30%:10%):isOpen?20%:5% */}
        <motion.div
          animate={{
            width: isOpen ?(isMobile? "40%":"20%") : (isMobile?"10%":"5%"),

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          key="sidebar"
          className={`sidebar w-full h-screen`}
        >
          <div key="top_section" className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1 
                key="esolution"
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo xsm:hidden md:block"
                >
                  E Solution
                </motion.h1>
              )}
            </AnimatePresence>

            <div key="bar" className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
         
          <section className="routes" key="routes">
         
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                    key={index + "0"}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link"
                  activeclassname="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <motion.main 
        animate={{
            width: isOpen ?(isMobile? "60%":"80%") : (isMobile?"90%":"95%"),

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
        className="h-screen">
        <TopBar />
        <div className="h-[90%] md:h-[90%] xsm:h-[80%] overflow-auto">
        {children}
        </div>
        </motion.main>
      </div>
    </>
  );
};

export default SideBar;