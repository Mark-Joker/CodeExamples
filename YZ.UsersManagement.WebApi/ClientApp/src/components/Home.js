import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService'

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { users: [], isLoading: true };
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        return (
            <div className="container">
                <h1>Users</h1>
                <br></br>

                {this.state.isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/*Make a component*/}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ava</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Visits</th>
                                    <th scope="col">Last visit</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map((user, index) =>
                                    <tr key={user.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>[user.avatarUrl]</td>
                                        <td>{user.name}</td>
                                        <td>[admin]</td>
                                        <td>[user.visitsCount]</td>
                                        <td>[user.LastVisitDate]</td>
                                        <td>
                                            <button disabled={user.isDeleting} type="button" title="Delete" className="btn btn-outline-danger btn-sm" onClick={this.deleteUser.bind(this, user)}>
                                                {user.isDeleting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        <span className="visually-hidden">Deleting...</span>
                                                    </>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                                    </svg>
                                                )}
                                            </button>
                                            <Link to={`/profile/${user.id}`} className="btn btn-link">profile</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    async getUsers() {
        // TODO: move to usersService
        const token = await authService.getAccessToken();
        const response = await fetch('api/users', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();

            const uiUsers = this.mapToUiUsers(data);

            this.setState({ users: uiUsers });
        } else {
            alert(`It looks like something went wrong...\nResponse status: ${response.status}. Status text: ${response.statusText}.`);
        }

        this.setState({ isLoading: false });
    }

    async deleteUser(user) {
        const canDelete = window.confirm(`You are going to delete user:\n"${user.name}"\n\nAre you sure?`);
        if (!canDelete) return;

        const userId = user.id;

        this.showDeletingSpinner(userId, true);

        // TODO: move to usersService
        const token = await authService.getAccessToken();
        const response = await fetch(`api/users/${userId}`, {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            this.removeUserFromState(userId);
        } else {
            let errorText;

            try {
                const error = await response.json();
                errorText = `It looks like something went wrong...\nResponse status: ${response.status}. Status text: ${response.statusText}.\nMessage: ${error}`;
            } catch (exception) {
                errorText = `It looks like something went wrong...\nResponse status: ${response.status}. Status text: ${response.statusText}.`;
            }

            this.showDeletingSpinner(userId, false);

            alert(errorText);
        }
    }

    mapToUiUsers(apiUsers) {
        if (!apiUsers) return;

        const uiUsers = apiUsers.map(apiUser => {
            // Add property to the object for displaying deleting spinner
            apiUser['isDeleting'] = false;

            return apiUser;
        });

        return uiUsers;
    }

    showDeletingSpinner(userId, isVisible) {
        const users = this.state.users.map(user => {
            if (user.id === userId) {
                user.isDeleting = isVisible;
            }

            return user;
        });

        this.setState({ users: users });
    }

    removeUserFromState(userId) {
        const users = this.state.users.filter(u => u.id !== userId);
        this.setState({ users: users });
    }
}