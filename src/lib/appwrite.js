import { Client, Account, ID, Databases, Query, Avatars, Permission, Role, Storage } from 'appwrite';
import config from '../config/config';

const DEFAULT_PDF_THUMBNAIL = 'https://cdn4.iconfinder.com/data/icons/file-extension-names-vol-8/512/24-512.png';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize Account
export const account = new Account(client);

// Initialize Database
export const databases = new Databases(client);

// Initialize Storage
export const storage = new Storage(client);

class AuthService {
    constructor() {
        this.client = client;
        this.account = new Account(this.client);
        this.databases = databases;
        this.storage = storage;
        this.avatars = new Avatars(this.client);
    }

    // Initialize check - can be called when app starts
    async init() {
        try {
            // First check localStorage for session info
            const hasSession = localStorage.getItem('appwrite_session');
            if (!hasSession) {
                return null;
            }

            try {
                // Get current user data
                const user = await this.getCurrentUser();
                if (!user) {
                    localStorage.removeItem('appwrite_session');
                    return null;
                }
                return user;
            } catch (error) {
                // If there's an error getting user data, clear session
                localStorage.removeItem('appwrite_session');
                return null;
            }
        } catch (error) {
            console.error('Init error:', error);
            localStorage.removeItem('appwrite_session');
            return null;
        }
    }

    // Modified getCurrentUser to fetch both account and user collection data
    async getCurrentUser() {
        try {
            const account = await this.account.get();
            
            // Fetch user document from collection
            const userDocs = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteUserCollectionId,
                [
                    Query.equal('accountId', account.$id)
                ]
            );

            if (userDocs.documents.length === 0) {
                throw new Error('User document not found');
            }

            const userDoc = userDocs.documents[0];

            // Debug timestamps
            console.log('Timestamps:', {
                account_created: account.$createdAt,
                account_updated: account.$updatedAt,
                doc_created: userDoc.$createdAt,
                doc_updated: userDoc.$updatedAt
            });

            // Combine account and user doc data
            return {
                ...account,
                userDocId: userDoc.$id,
                ...userDoc,
                // Use both Appwrite's built-in timestamps and our custom ones
                $createdAt: account.$createdAt,
                $updatedAt: userDoc.$updatedAt,
                createdAt: account.$createdAt,
                updatedAt: userDoc.$updatedAt
            };
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    }

    async createAccount({ email, password, name }) {
        try {
            console.log('Creating account for:', email);
            
            // Create account
            const account = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            
            console.log('Account created successfully:', account.$id);

            // Create email session
            console.log('Creating session...');
            const session = await this.account.createEmailSession(email, password);
            console.log('Session created successfully');

            // Create user document in the users collection with queryCount and userType
            console.log('Creating user document...');
            const userDoc = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteUserCollectionId,
                ID.unique(),
                {
                    accountId: account.$id,
                    email: email,
                    username: name,
                    avatar: this.avatars.getInitials(name).toString(),
                    queryCount: 0,  // Initialize queryCount to 0
                    userType: 'standard'  // Set default userType to standard
                }
            );
            
            console.log('User document created successfully:', userDoc.$id);

            // Set session flag in localStorage
            localStorage.setItem('appwrite_session', 'true');

            // Get the complete user data with timestamps
            const userData = {
                ...account,
                userDocId: userDoc.$id,
                ...userDoc,
                createdAt: account.$createdAt,    // Account creation time
                updatedAt: userDoc.$updatedAt     // Document creation/update time
            };

            return {
                session,
                currentUser: userData
            };
        } catch (error) {
            console.error('Create account error:', error);
            
            if (error.message.includes('Invalid document structure')) {
                console.error('Document structure error:', error);
                throw new Error('Failed to create user document: Invalid structure');
            }
            
            // Handle specific error cases
            if (error.message.includes('already exists')) {
                throw new Error('An account with this email already exists');
            }
            
            if (error.message.includes('session')) {
                throw new Error('Failed to create login session');
            }
            
            if (error.message.includes('document')) {
                throw new Error('Failed to create user document');
            }
            
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // First check if there's an active session
            try {
                const currentSession = await this.account.getSession('current');
                if (currentSession) {
                    // Delete the current session before creating a new one
                    await this.account.deleteSession('current');
                }
            } catch (error) {
                // No active session or error getting session, we can proceed with login
                console.log('No active session found');
            }

            // Now create new session
            const session = await this.account.createEmailSession(email, password);
            
            // Set session flag in localStorage
            localStorage.setItem('appwrite_session', 'true');
            
            // Get user data
            let updatedUser = await this.getCurrentUser();
            
            // Check if we need to reset query count
            if (updatedUser) {
                const lastUpdated = new Date(updatedUser.$updatedAt);
                const today = new Date();
                
                // Check if last update was from a previous day
                if (lastUpdated.getDate() !== today.getDate() || 
                    lastUpdated.getMonth() !== today.getMonth() || 
                    lastUpdated.getFullYear() !== today.getFullYear()) {
                    
                    console.log('Resetting query count - new day');
                    
                    // Reset query count to 0
                    await this.databases.updateDocument(
                        config.appwriteDatabaseId,
                        config.appwriteUserCollectionId,
                        updatedUser.userDocId,
                        {
                            queryCount: 0
                        }
                    );
                    
                    // Get updated user data
                    updatedUser = await this.getCurrentUser();
                }
            }

            return { session, user: updatedUser };
        } catch (error) {
            console.error('Login error:', error);
            // Clear any existing session data
            localStorage.removeItem('appwrite_session');
            throw error;
        }
    }

    async logout() {
        try {
            // Delete all sessions
            await this.account.deleteSessions();
            // Clear local storage
            localStorage.removeItem('appwrite_session');
            localStorage.clear();
            // Return true to indicate successful logout
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage even if API call fails
            localStorage.removeItem('appwrite_session');
            localStorage.clear();
            throw error;
        }
    }

    async checkSession() {
        try {
            // Check if session is valid with Appwrite
            const user = await this.getCurrentUser();
            if (!user) {
                return { isValid: false, user: null };
            }

            // Get local UI data
            const localData = localStorage.getItem('userInfo');
            const userInfo = localData ? JSON.parse(localData) : null;

            // Validate and update local data if needed
            if (!userInfo || userInfo.email !== user.email) {
                const newUserInfo = {
                    name: user.name,
                    email: user.email,
                    lastLogin: new Date().toISOString()
                };
                localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
            }

            return {
                isValid: true,
                user: user
            };
        } catch (error) {
            return { isValid: false, user: null };
        }
    }

    async refreshSession() {
        try {
            const session = await this.account.getSession('current');
            if (!session) {
                throw new Error('No active session');
            }
            return session;
        } catch (error) {
            throw error;
        }
    }

    // Retry operation helper
    async retryOperation(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    // Get user's document count
    async getUserDocumentCount(userDocId) {
        try {
            const { total } = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteDocCollectionId,
                [Query.equal('users', userDocId), Query.limit(1)]
            );
            return total;
        } catch {
            return 0;
        }
    }

    // Get current user with document count
    async getCurrentUserWithDocs() {
        try {
            const account = await this.retryOperation(() => 
                this.account.get()
            );

            if (!account) {
                console.log('No account found');
                return null;
            }

            // Get user's document count
            const docCount = await this.getUserDocumentCount(account.$id);

            const userData = {
                ...account,
                documentCount: docCount
            };

            console.log('User data with document count retrieved successfully');
            return userData;

        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    // Add this method to AuthService class
    async getUserDocuments(userId) {
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteDocCollectionId,
                [
                    Query.equal('users', userId),
                    Query.orderDesc('$createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error in getUserDocuments:', error);
            throw error;
        }
    }

    async uploadDocument(file, userId, metadata = {}) {
        let fileUpload = null;
        let documentData = null;
        try {
            // First upload file to storage
            fileUpload = await this.storage.createFile(
                config.appwriteStorageId,
                ID.unique(),
                file,
                [Permission.write(Role.users()), Permission.read(Role.users())]
            );

            // Get file view URL for document
            const documentUrl = this.storage.getFileView(
                config.appwriteStorageId,
                fileUpload.$id
            ).toString();

            // Create document in documents collection
            documentData = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteDocCollectionId,
                ID.unique(),
                {
                    title: metadata.title || file.name,
                    thumbnail: DEFAULT_PDF_THUMBNAIL,
                    document: documentUrl,
                    users: userId,
                    author: metadata.author || '',
                    description: metadata.description || '',
                }
            );

            // Switch back to upload endpoint
            const apiUrl = config.uploadApiEndpoint;
            console.log('\n🚀 Sending API request to:', apiUrl);
            
            const payload = {
                input: {
                    messages: [{
                        role: 'user',
                        content: {
                            pdf_url: documentUrl,
                            user_id: userId,
                            action: 'add'
                        }
                    }]
                }
            };

            console.log('\n📤 Upload API Payload:', JSON.stringify(payload, null, 2));

            // Keep the working no-cors configuration
            const response = await fetch(apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Since we're using no-cors, we won't be able to read the response
            // but if we get here without an error, consider it successful
            return {
                success: true,
                message: "Document uploaded successfully",
                data: {
                    ...fileUpload,
                    ...documentData,
                    ...metadata,
                    previewUrl: DEFAULT_PDF_THUMBNAIL,
                    viewUrl: documentUrl,
                    userId
                }
            };

        } catch (error) {
            // Cleanup on error
            if (documentData?.$id || fileUpload?.$id) {
                await this.cleanupResources(documentData?.$id, fileUpload?.$id);
            }
            console.error('\n❌ Error in uploadDocument:', error);
            throw error;
        }
    }

    // Add this helper method to handle cleanup
    async cleanupResources(documentId, fileId) {
        if (documentId) {
            try {
                console.log('\n🗑️ Cleaning up document:', documentId);
                await this.databases.deleteDocument(
                    config.appwriteDatabaseId,
                    config.appwriteDocCollectionId,
                    documentId
                );
                console.log('✅ Document cleanup successful');
            } catch (error) {
                console.warn('⚠️ Document cleanup failed:', error.message);
            }
        }
        
        if (fileId) {
            try {
                console.log('\n🗑️ Cleaning up file:', fileId);
                await this.storage.deleteFile(
                    config.appwriteStorageId,
                    fileId
                );
                console.log('✅ File cleanup successful');
            } catch (error) {
                console.warn('⚠️ File cleanup failed:', error.message);
            }
        }
    }

    async deleteDocument(documentId) {
        try {
            console.log('\n🔍 Starting document deletion process for:', documentId);

            // First get the document from collection
            const document = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteDocCollectionId,
                documentId
            );

            console.log('\n📄 Retrieved document:', document);

            // Extract file ID from document URL
            const fileId = document.document.split('/files/')[1].split('/')[0];
            console.log('\n📁 Extracted file ID:', fileId);

            // First send the API request to delete from vector DB
            try {
                const apiUrl = config.deleteApiEndpoint;
                console.log('\n🚀 Sending delete request to API:', apiUrl);
                
                const userId = typeof document.users === 'object' ? document.users.$id : document.users;
                const documentUrl = document.document;

                console.log('\n🔍 Verification:', {
                    userId,
                    documentUrl,
                    fileId
                });

                const payload = {
                    input: {
                        messages: [{
                            role: 'user',
                            content: {
                                pdf_url: documentUrl,
                                user_id: userId,
                                action: 'delete'
                            }
                        }]
                    }
                };

                console.log('\n📤 Delete API Payload:', JSON.stringify(payload, null, 2));

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const responseData = await response.json();
                console.log('\n✅ API Response:', JSON.stringify(responseData, null, 2));

                // Parse the response body if it's a string
                const parsedBody = typeof responseData.body === 'string' 
                    ? JSON.parse(responseData.body) 
                    : responseData.body;

                // Check for API errors
                if (responseData.statusCode === 500 || !parsedBody?.success) {
                    console.error('\n❌ API Error:', parsedBody?.message || 'Unknown API error');
                    throw new Error(parsedBody?.message || 'API deletion failed');
                }

                // Check for timeout
                const isTimeout = 
                    responseData?.message === "Endpoint request timed out" || 
                    (responseData?.errorMessage && responseData.errorMessage.toLowerCase().includes('timed out'));

                if (isTimeout) {
                    console.log('\n⏳ Timeout detected - continuing with deletion');
                }

                // Only proceed with deletion if API call was successful or timed out
                console.log('\n🗑️ Deleting file from storage:', fileId);
                await this.storage.deleteFile(
                    config.appwriteStorageId,
                    fileId
                );
                console.log('\n✅ File deleted successfully');

                console.log('\n🗑️ Deleting document from collection:', documentId);
                await this.databases.deleteDocument(
                    config.appwriteDatabaseId,
                    config.appwriteDocCollectionId,
                    documentId
                );
                console.log('\n✨ Document deleted successfully');

            } catch (error) {
                console.error('\n❌ Error during deletion process:', error);
                throw error; // Re-throw to prevent deletion on API error
            }

        } catch (error) {
            console.error('\n❌ Error in deleteDocument:', error);
            throw error;
        }
    }

    async getUserQueryCount(userId) {
        try {
            const userDocs = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteUserCollectionId,
                [Query.equal('accountId', userId)]
            );

            if (userDocs.documents.length === 0) {
                throw new Error('User document not found');
            }

            return userDocs.documents[0].queryCount;
        } catch (error) {
            console.error('Error getting user query count:', error);
            throw error;
        }
    }

    async incrementUserQueryCount(userId) {
        try {
            // First get the user document
            const userDocs = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteUserCollectionId,
                [Query.equal('accountId', userId)]
            );

            if (userDocs.documents.length === 0) {
                throw new Error('User document not found');
            }

            const userDoc = userDocs.documents[0];
            
            // Update the document with incremented queryCount
            await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteUserCollectionId,
                userDoc.$id,
                {
                    queryCount: (userDoc.queryCount || 0) + 1
                }
            );

            return userDoc.queryCount + 1;
        } catch (error) {
            console.error('Error incrementing query count:', error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService; 