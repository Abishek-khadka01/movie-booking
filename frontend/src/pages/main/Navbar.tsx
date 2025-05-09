import { useEffect, useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationSocket from '../../services/sockets/notification.sockets';
import { SEND_NOTICATIONS } from '../../constants/constants';
import useUserStore from '../../context/userContext';

type NotificationType = {
  id: string;
  title: string;
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationType[]>([
    { id: "1", title: "🎬 New movie 'Oppenheimer' released!" },
    { id: "2", title: "✅ Your ticket for 'The Matrix' is confirmed." },
    { id: "3", title: "🎟️ Show reminder: 'Interstellar' at 7:00 PM." },
  ]);

  const user = useUserStore.getState().user;
  const isLoggedIn = user?.isLogin;
  const NotificationSocketInstance = NotificationSocket.GetInstance(user?._id as string);

  useEffect(() => {
    if (!NotificationSocketInstance) return;

    const handleNewNotification = (message: NotificationType) => {
      console.log(message);
      setNotifications(prev => [...prev, { id: message.id, title: message.title }]);
    };

    NotificationSocketInstance.on(SEND_NOTICATIONS, handleNewNotification);

    return () => {
      NotificationSocketInstance.off(SEND_NOTICATIONS, handleNewNotification);
    };
  }, [NotificationSocketInstance]);

  return (
    <nav className="bg-white shadow-md px-6 py-4 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>
          Online-Ticket
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="movies" className="text-gray-700 hover:text-indigo-600">Movies</Link>
          <Link to="allshows" className="text-gray-700 hover:text-indigo-600">Today's Shows</Link>

          {isLoggedIn ? (
            <>
              <div className="relative">
                <button
                  className="relative text-gray-600 hover:text-indigo-600"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b font-medium text-gray-700 flex justify-between items-center">
                      Notifications
                      <button
                        onClick={() => setNotifications([])}
                        className="text-sm text-indigo-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              navigate(`/shows/${notif.id}`);
                              setShowNotifications(false);
                            }}
                          >
                            {notif.title}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-gray-500 text-sm text-center">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700">{user?.username}</span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Change Password</Link>
                    <Link to="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Login</Link>
              <Link to="register" className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">Register</Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2 px-2 pb-4">
          <Link to="movies" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Movies</Link>
          <Link to="allshows" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Today's Shows</Link>

          {isLoggedIn ? (
            <>
              <div className="block px-4 py-2 text-gray-700 font-medium">Notifications</div>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/shows/${notif.id}`);
                      setMenuOpen(false);
                    }}
                  >
                    {notif.title}
                  </div>
                ))
              ) : (
                <div className="px-4 text-sm text-gray-500">No notifications</div>
              )}
              <hr />
              <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
              <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Change Password</Link>
              <Link to="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</Link>
            </>
          ) : (
            <>
              <Link to="login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Login</Link>
              <Link to="register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
