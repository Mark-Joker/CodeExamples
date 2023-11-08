import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class Profile extends Component {

    userId = null;
    initialUserRoles = [];
    initialAvatar = null;
    avatarFile = null;
    avatarFileName = null;

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            availableRoles: [],
            isLoading: true,
            isEditingRoles: false,
            wasRolesChanged: false,
            isSavingRoles: false,
            wasAvatarChanged: false,
            isSavingAvatar: false,
            isEditingAvatar: false
        };
    }

    async componentDidMount() {
        await this.prepare();
    }

    render() {
        return (
            <div className="container">
                <h1>Profile</h1>
                <br></br>

                {this.state.isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-secondary">avatar</label>
                            <div className="col-sm-4">
                                {!this.state.user.avatar ? (
                                    <svg className="bd-placeholder-img img-thumbnail" width="200" height="200" xmlns="http://www.w3.org/2000/svg" role="img"
                                        aria-label="User avatar"
                                        preserveAspectRatio="xMidYMid slice"
                                        focusable="false">
                                        <title>User avatar</title>
                                        <rect width="100%" height="100%" fill="#868e96" />
                                        <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                                        </text>
                                    </svg>
                                ) : (
                                    <img alt="avatar" id="avatarPicture" className="img-thumbnail"
                                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                        src={this.state.user.avatar ? this.state.user.avatar : ""} />
                                )}
                            </div>
                            <div className="col-sm-6">
                                <div className="d-grid gap-2 d-md-flex left-content-md-end">
                                    {!this.state.isEditingAvatar && (<button className="btn btn-outline-primary" type="button" title="edit roles" onClick={this.editAvatar.bind(this)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                    </button>)}
                                    {this.state.isEditingAvatar && (
                                        <>
                                            <input className="form-control" type="file" id="avatarFile" name="avatarFile" accept=".svg,.png,.jpg,.jpeg"
                                                onChange={e => this.handleAvatarFileChange(e)} disabled={this.state.isSavingAvatar} />
                                            <button className="btn btn-outline-primary" title="remove" type="button" onClick={this.removeAvatar.bind(this)} disabled={!this.initialAvatar || !this.state.user.avatar || this.state.isSavingAvatar}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-backspace" viewBox="0 0 16 16">
                                                    <path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z" />
                                                    <path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z" />
                                                </svg>
                                            </button>
                                            <button className="btn btn-outline-primary" type="button" title="save" onClick={this.saveAvatar.bind(this)} disabled={!this.state.wasAvatarChanged || this.state.isSavingAvatar}>
                                                {this.state.isSavingAvatar ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        <span className="visually-hidden">saving...</span>
                                                    </>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16">
                                                        <path d="M11 2H9v3h2V2Z" />
                                                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0ZM1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5Zm3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4v4.5ZM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V15Z" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button className="btn btn-outline-primary" type="button" title="undo" onClick={this.undoAvatarChanges.bind(this)} disabled={!this.state.wasAvatarChanged || this.state.isSavingAvatar}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                                                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                                                </svg>
                                            </button>
                                            <button className="btn btn-outline-primary" type="button" onClick={this.cancelAvatarEditing.bind(this)} disabled={this.state.isSavingAvatar}>Cancel</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="userName" className="col-sm-2 col-form-label text-secondary">user name</label>
                            <div className="col-sm-4">
                                <input type="text" disabled className="form-control-plaintext" id="userName" value={this.state.user.name} />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="visitsCount" className="col-sm-2 col-form-label text-secondary">visits count</label>
                            <div className="col-sm-4">
                                <input type="text" readOnly className="form-control-plaintext" id="visitsCount" value="[325]" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="lastVisitDate" className="col-sm-2 col-form-label text-secondary">last visit</label>
                            <div className="col-sm-4">
                                <input type="text" readOnly className="form-control-plaintext" id="lastVisitDate" value="[22:54   20.10.2023]" />
                            </div>
                        </div>

                        <br />
                        <h6>Roles</h6>
                        <hr />
                        <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-secondary">roles</label>
                            <div className="col-sm-4">
                                {this.state.availableRoles.map(role =>
                                    <div key={role.name} className={this.state.isSavingRoles ? ("form-check form-switch placeholder-glow") : ("form-check form-switch")}>
                                        <input className={this.state.isSavingRoles ? ("form-check-input placeholder") : ("form-check-input")} type="checkbox" role="switch" id={role.name} checked={role.isAssigned} onChange={e => this.handleRoleClick(e.target.checked, role.name)} disabled={!this.state.isEditingRoles || this.state.isSavingRoles} />
                                        <label className={this.state.isSavingRoles ? ("form-check-label placeholder") : ("form-check-label")} htmlFor={role.name}>{role.name}</label>
                                    </div>
                                )}
                            </div>
                            <div className="col-sm-6">
                                <div className="d-grid gap-2 d-md-flex left-content-md-end">
                                    {!this.state.isEditingRoles && (<button className="btn btn-outline-primary" type="button" title="edit roles" onClick={this.editRoles.bind(this)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                    </button>)}
                                    {this.state.isEditingRoles && (<button className="btn btn-outline-primary" type="button" title="save" onClick={this.updateRoles.bind(this, this.state.availableRoles)} disabled={!this.state.wasRolesChanged || this.state.isSavingRoles}>
                                        {this.state.isSavingRoles ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                <span className="visually-hidden">saving...</span>
                                            </>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16">
                                                <path d="M11 2H9v3h2V2Z" />
                                                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0ZM1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5Zm3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4v4.5ZM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V15Z" />
                                            </svg>
                                        )}
                                    </button>)}
                                    {this.state.isEditingRoles && (<button className="btn btn-outline-primary" type="button" title="undo" onClick={this.undoRolesChanges.bind(this)} disabled={!this.state.wasRolesChanged || this.state.isSavingRoles}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                                        </svg>
                                    </button>)}
                                    {this.state.isEditingRoles && (<button className="btn btn-outline-primary" type="button" onClick={this.cancelEditing.bind(this)} disabled={this.state.isSavingRoles}>Cancel</button>)}
                                </div>
                            </div>
                        </div>

                        <br />
                        <h6>Email</h6>
                        <hr />
                        <div className="mb-3 row">
                            <label htmlFor="email" className="col-sm-2 col-form-label text-secondary">email</label>
                            <div className="col-sm-4">
                                <input type="text" disabled className="form-control" id="email" value={this.state.user.email} />
                            </div>
                            <div className="col-sm-6">
                                <div className="d-grid gap-2 d-md-flex left-content-md-end">
                                    <button className="btn btn-outline-primary" type="button" title="edit email" disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <br />
                        <h6>Password</h6>
                        <hr />
                        <div className="mb-3 row">
                            <label htmlFor="currentPassword" className="col-sm-2 col-form-label text-secondary">current password</label>
                            <div className="col-sm-4">
                                <input disabled type="password" className="form-control" id="currentPassword" value="current password" />
                            </div>
                            <div className="col-sm-6">
                                <div className="d-grid gap-2 d-md-flex left-content-md-end">
                                    <button className="btn btn-outline-primary" type="button" title="edit email" disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="newPassword" className="col-sm-2 col-form-label text-secondary">new password</label>
                            <div className="col-sm-4">
                                <input disabled type="password" className="form-control" id="newPassword" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="confirmNewPassword" className="col-sm-2 col-form-label text-secondary">confirm new password</label>
                            <div className="col-sm-4">
                                <input disabled type="password" className="form-control" id="confirmNewPassword" />
                            </div>
                        </div>

                        <br />
                        <h6>Actions</h6>
                        <hr />
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" title="Delete" className="btn btn-outline-danger" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg>
                            </button>
                        </div>
                        <br />
                        <br />
                        <br />
                    </>
                )}
            </div>
        );
    }

    async prepare() {
        this.userId = this.getUserIdUrlParam();
        const user = await this.getUser(this.userId);

        const roles = await this.getAvailableRoles();

        const preparedRoles = this.prepareRoles(roles, user);

        this.initialUserRoles = preparedRoles.map((role) => ({ name: role.name, isAssigned: role.isAssigned }));

        const preparedAvatar = user.avatar ? `data:image/*;base64,${user.avatar}` : null;

        this.initialAvatar = preparedAvatar;

        user.avatar = preparedAvatar;

        this.setState({ user: user, availableRoles: preparedRoles, isLoading: false });
    }

    async getAvailableRoles() {
        // TODO: move to rolesService
        const token = await authService.getAccessToken();
        const response = await fetch(`api/roles`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });

        let roles = null;

        if (response.ok) {
            roles = await response.json();
        } else {
            const errorText = await this.retrieveError(response);
            alert(errorText);
        }

        return roles;
    }

    async getUser(userId) {
        // TODO: move to usersService
        const token = await authService.getAccessToken();
        const response = await fetch(`api/users/${userId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });

        let user = null;

        if (response.ok) {
            user = await response.json();
        } else {
            const errorText = await this.retrieveError(response);
            alert(errorText);
        }

        return user;
    }

    prepareRoles(availableRoles, user) {
        const roles = availableRoles.map(avRole => {
            const isAssignedToUser = user.roles.includes(avRole);

            if (isAssignedToUser) {
                return { name: avRole, isAssigned: true };
            } else {
                return { name: avRole, isAssigned: false };
            }
        });

        return roles;
    }

    // TODO: move to some helper class. Use in Home component. 
    async retrieveError(response) {
        let errorText;

        try {
            const error = await response.json();
            errorText = `It looks like something went wrong...\nResponse status: ${response.status}. Status text: ${response.statusText}.\nMessage: ${error}`;
        } catch (exception) {
            errorText = `It looks like something went wrong...\nResponse status: ${response.status}. Status text: ${response.statusText}.`;
        }

        return errorText;
    }

    getUserIdUrlParam() {
        let path = window.location.pathname;
        let segments = path.split('/');
        const id = segments[2];

        return id;
    }

    editAvatar() {
        this.setState({ isEditingAvatar: true });
    }

    undoAvatarChanges() {
        this.resetAvatarInput();

        let user = this.state.user;
        user.avatar = this.initialAvatar;

        this.setState({ user: user, wasAvatarChanged: false });
    }

    removeAvatar() {
        this.resetAvatarInput();

        this.avatarFile = null;

        let user = this.state.user;
        user.avatar = null;

        this.setState({ user: user, wasAvatarChanged: true });
    }

    resetAvatarInput() {
        document.getElementById('avatarFile').value = "";
    }

    cancelAvatarEditing() {
        if (this.state.wasAvatarChanged) {
            this.undoAvatarChanges();
        }

        this.setState({ isEditingAvatar: false });
    }

    handleAvatarFileChange(e) {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        this.avatarFile = file;
        this.avatarFileName = file.name;

        let user = this.state.user;
        const imgData = window.URL.createObjectURL(file);
        user.avatar = imgData;

        this.setState({ user: user, wasAvatarChanged: true });
    }

    async saveAvatar() {
        this.setState({ isSavingAvatar: true });

        const formData = new FormData();
        formData.append("avatarFile", this.avatarFile ? this.avatarFile : new Blob(), this.avatarFileName);

        // TODO: move to usersService
        const token = await authService.getAccessToken();

        const response = await fetch(`api/users/${this.userId}/avatar`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            this.initialAvatar = this.state.user.avatar;

            this.setState({ isEditingAvatar: false, wasAvatarChanged: false });
        } else {
            const errorText = await this.retrieveError(response);

            alert(errorText);
        }

        this.setState({ isSavingAvatar: false });
    }

    handleRoleClick(isChecked, roleName) {
        this.state.availableRoles.forEach((role) => {
            if (role.name === roleName) role.isAssigned = isChecked;
        });

        const wasInitRolesChanged = this.checkInitRolesChanged(this.state.availableRoles, this.initialUserRoles);

        this.setState({ availableRoles: this.state.availableRoles, wasRolesChanged: wasInitRolesChanged });
    }

    checkInitRolesChanged(modifiedRoles, initialUserRoles) {
        const changed = JSON.stringify(modifiedRoles) !== JSON.stringify(initialUserRoles);

        return changed;
    }

    async updateRoles(availableRoles) {
        this.setState({ isSavingRoles: true });

        // TODO: move to usersService
        const token = await authService.getAccessToken();

        const roles = this.mapRolesToApi(availableRoles);

        const response = await fetch(`api/users/${this.userId}/roles`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(roles)
        });

        if (response.ok) {
            this.updateInitialRoles(this.state.availableRoles);

            this.setState({ isEditingRoles: false, wasRolesChanged: false });
        } else {
            const errorText = await this.retrieveError(response);

            alert(errorText);
        }

        this.setState({ isSavingRoles: false });
    }

    mapRolesToApi(availableRoles) {
        let roles = availableRoles.filter(r => r.isAssigned);

        roles = roles.map(r => r.name);

        return roles;
    }

    updateInitialRoles(availableRoles) {
        let aRole;
        this.initialUserRoles.forEach((iRole) => {
            aRole = availableRoles.find((r) => r.name === iRole.name);
            iRole.isAssigned = aRole.isAssigned;
        });
    }

    editRoles() {
        this.setState({ isEditingRoles: true });
    }

    undoRolesChanges() {
        let initRole;
        this.state.availableRoles.forEach((avRole) => {
            initRole = this.initialUserRoles.find((iRole) => iRole.name === avRole.name);

            avRole.isAssigned = initRole.isAssigned;
        });

        this.setState({ availableRoles: this.state.availableRoles, wasRolesChanged: false });
    }

    cancelEditing() {
        if (this.state.wasRolesChanged) {
            this.undoRolesChanges();
        }

        this.setState({ isEditingRoles: false });
    }
}