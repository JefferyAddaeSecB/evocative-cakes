import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User,
} from 'firebase/auth'
import { auth } from './firebase'

export interface AuthUser extends User {
  role?: 'client' | 'therapist' | 'admin'
}

export const signUp = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserLocalPersistence)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    await setPersistence(auth, browserLocalPersistence)
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

export const getCurrentUser = () => {
  return auth.currentUser
}
