import User from '../database/models/userModel';
import UserDTO from '../dtos/userDTO';

function mapToUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    joinDate: user.joinDate,
    role: user.role,
  };
}

export default mapToUserDTO;
