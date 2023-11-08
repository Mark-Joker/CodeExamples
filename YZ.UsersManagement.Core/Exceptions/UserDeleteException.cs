namespace YZ.UsersManagement.Core.Exceptions;

public class UserDeleteException : Exception
{
    public UserDeleteException(string message = "Can't delete a user.") : base(message) { }
}