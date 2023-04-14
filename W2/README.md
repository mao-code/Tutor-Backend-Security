# :pushpin: Outline
### (For only basic NodeJS project. We will build another complete project in the future)
1. Password Salting & Encryption
2. JWT concept & Access/Refresh Token
3. RBAC concept & implementation via middleware

# Download Packages
1. bcrypt

# :pencil: Explaination
## Password Hash Salting
* Password salting involves adding random data to a password before hashing it. <u>The random data is called a salt</u>
* Salting makes the attacker cannot directly use the precomputed hash tables(rainbow table) to crack password because the salt makes each hash unique.
* Involves adding salt and hashing

## Hashing
* <u>One-way process(irreversible)</u> that converts plaintext into a fixed-length string of characters (the hash)
* With a hash function (e.g. MD5, SHA1, SHA256, bcrypt)
* Same input will always produce the same output (so rainbow table is computed)

## Slow Hashing (e.g. Bcrypt)
* Slow hashing is a technique used to make password hashing computationally expensive and time-consuming
* The idea behind slow hashing is to intentionally slow down the hash function used for password hashing, by adding a computationally intensive step or a delay factor, such as <u>multiple rounds of hashing</u>.
* We will use Bcrypt: 
    * Bcrypt is a password-hashing function that is designed to be <u>slow and computationally expensive</u>. 
    * This makes it resistant to brute-force attacks and makes it more difficult for attackers to crack passwords.

## How to compare password?
* Compare the hashed values to authenticate users without the need to store the plaintext password itself.

<img
width="600px"
src="./images/salt-hash.png"
alt="salt-hash"></img>

---

## JWT


<img
width="600px"
src="./images/JWT.JPG"
alt="salt-hash"></img>

## AccessToken and RefreshToken

# Resources
* [Bcrypt tutorial](https://blog.logrocket.com/password-hashing-node-js-bcrypt/)
* [JWT website](https://jwt.io/)
