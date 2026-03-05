"use client";

import React, { useState } from 'react';
import './UsersTable.scss';
import { useUsers, useDeleteUser } from '@/lib/user/hooks/hooks'; 
import { Trash2 } from 'lucide-react'; 

const UsersTable = () => {
  const { data: users = [], isLoading, error } = useUsers();
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser(); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 
  const totalPages = Math.ceil(users.length / itemsPerPage);

  if (isLoading) return <div className="p-6">Загрузка пользователей...</div>;
  if (error) return <div className="p-6 text-red-500">Ошибка загрузки: {error.message}</div>;

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      deleteUser(id);
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Пользователи</h2>
      
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Ф.И.О</th>
              <th>Номер</th>
              <th>Электронная почта</th>
              <th style={{ width: '50px' }}></th> 
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || user.full_name || 'Не указано'}</td>
                  <td>{user.number || user.phone_number || '---'}</td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                      title="Удалить пользователя"
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                  Пользователей пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {users.length > itemsPerPage && (
        <div className="pagination">
          <button 
            className="page-btn arrow" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            &lt;
          </button>
          
          <button className={`page-btn active`}>{currentPage}</button>
          
          {currentPage < totalPages && (
            <>
              <span className="dots">...</span>
              <button className="page-btn" onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </button>
            </>
          )}

          <button 
            className="page-btn arrow" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersTable;