import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  async getUser(userId: string) {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    return response.data.data;
  }

  async createUser(user: UserDto) {
    const response = await axios.post('https://reqres.in/api/users', user);
    return response.data;
  }

  async getUserAvatar(userId: string) {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    const avatarUrl = response.data.data.avatar;
    const avatarResponse = await axios.get(avatarUrl, {
      responseType: 'arraybuffer',
    });
    const avatarBase64 = Buffer.from(avatarResponse.data).toString('base64');

    return avatarBase64;
  }

  async deleteUserAvatar(userId: string) {
    try {
      // Remove o usuário no Reqres.in
      await axios.delete(`https://reqres.in/api/users/${userId}`);
    } catch (error) {
      throw new Error(
        `cant delete user id avatar: ${userId}: ${error.message}`,
      );
    }
  }
}
