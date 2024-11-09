export const shortenAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export const fetchAddressAvatar = (address) => {
    return `https://avatars.dicebear.com/api/identicon/${address}.svg`;
}

