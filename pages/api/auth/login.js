import { ok, unauthorized, badRequest, checkPassword, createSecureToken } from 'next-basics';
import { getAccountByUsername } from 'queries/admin/account/getAccountByUsername';
import { secret } from 'lib/crypto';

export default async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return badRequest(res);
  }

  const account = await getAccountByUsername(username);

  if (account && checkPassword(password, account.password)) {
    const { user_id, username, is_admin } = account;
    const user = { user_id, username, is_admin };
    const token = createSecureToken(user, secret());

    return ok(res, { token, user });
  }

  return unauthorized(res);
};
