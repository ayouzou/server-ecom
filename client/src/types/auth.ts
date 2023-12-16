import React from 'react'

export type User = {
    id :string ;
    email :string ;
    role :'SELLER' ;
    username:string;
    token:string ;
} | null;


export type Session ={
    isAuthenticated:boolean ;
    user:User;
};

export type SessionProviderProps={
  children: React.ReactNode;
};