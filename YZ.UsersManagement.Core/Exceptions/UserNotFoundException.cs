namespace YZ.UsersManagement.Core.Exceptions;

public class UserNotFoundException : Exception
{
    public UserNotFoundException(string message = "Can't find such a user.") : base(message) { }
}