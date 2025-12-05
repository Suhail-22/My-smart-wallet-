import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineAccountBalanceWallet, MdCreditCard, MdOutlineTimeline, MdOutlineTrendingUp, MdOutlineCalculate, MdOutlineSettings, MdDarkMode, MdLightMode, MdInstallDesktop, MdAdd, MdMenu, MdClose, MdExitToApp, MdOutlineMenuBook, MdOutlinePeople } from "react-icons/md";
import InstallButton from "./InstallButton";
import TransactionForm from "../pages/TransactionForm"; // تأكد من المسار الصحيح

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // حالة التحكم في الثيم (Theme)
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );

    // *** إضافة حالة لفتح وإغلاق نموذج المعاملة (FAB Modal) ***
    const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    const navItems = [
        { path: "/", icon: MdOutlineDashboard, label: "الرئيسية" },
        { path: "/transaction-form", icon: MdAdd, label: "إضافة معاملة" }, // هذا الخيار في القائمة الجانبية يمكن أن يبقى أو يحذف
        { path: "/transactions", icon: MdOutlineTimeline, label: "المعاملات" },
        { path: "/budget", icon: MdOutlineCalculate, label: "الميزانية" },
        { path: "/wallets", icon: MdOutlineAccountBalanceWallet, label: "المحافظ" },
        { path: "/debts", icon: MdCreditCard, label: "الديون" },
        { path: "/investments", icon: MdOutlineTrendingUp, label: "الاستثمارات" },
        { path: "/zakat", icon: MdOutlineMenuBook, label: "الزكاة" },
        { path: "/settings", icon: MdOutlineSettings, label: "الإعدادات" },
    ];

    return (
        <div className={`flex flex-col h-screen max-w-lg mx-auto overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
            {/* Header / Top Bar */}
            <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-gray-700 dark:text-gray-200"
                >
                    <MdMenu size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">محفظتي الذكية</h1>
                <InstallButton />
            </header>

            {/* Sidebar / Menu */}
            <aside
                className={`fixed inset-y-0 right-0 z-[100] w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    } md:hidden`}
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">القائمة</h2>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-700 dark:text-gray-200"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                    <nav className="flex-grow">
                        <ul>
                            {navItems.map((item) => (
                                <li key={item.path} className="mb-2">
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center w-full p-2 rounded-lg transition-colors ${location.pathname === item.path
                                                ? "bg-indigo-500 text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <item.icon size={20} className="ml-3" />
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center w-full p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === "light" ? (
                                <MdDarkMode size={20} className="ml-3" />
                            ) : (
                                <MdLightMode size={20} className="ml-3" />
                            )}
                            {theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
                        </button>
                        <button
                            onClick={() => console.log("Logout")} // تحتاج لتعريف دالة الخروج
                            className="flex items-center w-full p-2 mt-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                            <MdExitToApp size={20} className="ml-3" />
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-800">
                {children}
            </main>

            {/* *** الزر العائم (Floating Action Button - FAB) *** */}
            <button
                className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-full p-4 shadow-xl z-50 transition-all hover:bg-green-600 active:scale-95 md:bottom-8"
                onClick={() => setIsTransactionFormOpen(true)}
                aria-label="Add Transaction"
            >
                <MdAdd size={30} />
            </button>

            {/* Footer / Bottom Navigation (إذا كانت موجودة في تصميمك الأصلي) */}
            {/* يمكنك إضافة مكون شريط التنقل السفلي هنا إذا كنت تستخدمه */}

            {/* *** نافذة نموذج المعاملة المنبثقة (Modal) *** */}
            {isTransactionFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-sm max-h-[90vh] overflow-y-auto relative p-6">
                        <button
                            className="absolute top-3 left-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                            onClick={() => setIsTransactionFormOpen(false)}
                        >
                            <MdClose size={24} />
                        </button>
                        {/* هنا نضع مكون نموذج المعاملة الذي سيتم تعديله في الخطوة التالية */}
                        <TransactionForm onClose={() => setIsTransactionFormOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
