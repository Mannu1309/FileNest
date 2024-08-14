import React, { useState, useEffect } from "react";
import { storage, auth, signOut } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import './Upload.css'

function Upload() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchFiles(currentUser.uid);
            }
        });
    }, []);

    const fetchFiles = async (userId) => {
        setLoading(true)
        const storageRef = ref(storage, `files/${userId}`);
        const fileList = await listAll(storageRef);
        const fileUrls = await Promise.all(
            fileList.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setFiles(fileUrls);
        setLoading(false)
    };

    const handleUpload = () => {
        if (file && user) {
            const storageRef = ref(storage, `files/${user.uid}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    console.error("Upload failed:", error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setFiles((prevFiles) => [...prevFiles, downloadURL]);
                    setProgress(0);
                }
            );
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        // Redirect to login page
    };


    const handleDelete = (fileUrl) => {
        const storageRef = ref(storage, fileUrl);
        deleteObject(storageRef)
            .then(() => {
                setFiles(files.filter((url) => url !== fileUrl));
            })
            .catch((error) => console.error("Error deleting file:", error));
    };

    return (
        <div>
            {user && (
                <div className="user">
                    <div className="user-info">
                        <span>Welcome, {user.email}</span><br/>
                    </div>
                    <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
            )}
            <div className="upload-container">
                <h2>UPLOAD FILE</h2>
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button className="upload" onClick={handleUpload}>Upload</button>
                <progress value={progress} max="100" />
                <div className="file-list">
                    <h3>Uploaded Files</h3>
                    {loading? "Loading...": files.map((fileUrl, index) => {

                        // Extract the file name from the URL path
                        const decodedUrl = decodeURIComponent(fileUrl);
                        const fileName = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1, decodedUrl.lastIndexOf('?') !== -1 ? decodedUrl.lastIndexOf('?') : decodedUrl.length);

                        return <div key={index} className="file-item">
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                {fileName}
                            </a>
                            <button onClick={() => handleDelete(fileUrl)}>Delete</button>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default Upload;
