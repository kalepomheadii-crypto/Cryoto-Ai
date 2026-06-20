import hashlib
import itertools
import sys

# BIP39 English wordlist (first 4 letters unique)
WORDLIST = [
    "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
    # ... (full list is long; download it or I'll provide a way to load it)
    # For full list: https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt
]  # Replace with full 2048 words

def load_wordlist():
    # In practice, download english.txt and load it
    try:
        with open("bip39_english.txt", "r") as f:
            return [w.strip() for w in f.readlines()]
    except FileNotFoundError:
        print("Download bip39 english wordlist and save as bip39_english.txt")
        sys.exit(1)

def is_valid_mnemonic(mnemonic_words):
    wordlist = load_wordlist()
    if len(mnemonic_words) not in (12, 15, 18, 21, 24):
        return False
    try:
        idx = [wordlist.index(w) for w in mnemonic_words]
    except ValueError:
        return False
    
    # Convert to bits
    bits = ''.join(f'{i:011b}' for i in idx)
    entropy_bits = bits[:-len(bits)//32]  # remove checksum
    checksum = bits[-len(bits)//32:]
    
    entropy = int(entropy_bits, 2).to_bytes(len(entropy_bits)//8, 'big')
    hash_check = hashlib.sha256(entropy).hexdigest()
    calculated_checksum = bin(int(hash_check, 16))[2:].zfill(256)[:len(checksum)]
    return checksum == calculated_checksum

def find_checksum_word(first_words):
    """If you have first 11 or 23 words, find possible last word"""
    wordlist = load_wordlist()
    candidates = []
    for word in wordlist:
        candidate = first_words + [word]
        if is_valid_mnemonic(candidate):
            candidates.append(word)
    return candidates

# Example usage
if __name__ == "__main__":
    print("Crypto Seed Phrase Recovery Helper")
    print("1: Find checksum word (provide first 11 or 23)")
    print("2: Validate full phrase")
    
    choice = input("Choose: ")
    if choice == "1":
        words = input("Enter first words separated by space: ").strip().lower().split()
        possibles = find_checksum_word(words)
        print("Possible last words:", possibles)
    elif choice == "2":
        phrase = input("Enter full seed phrase: ").strip().lower().split()
        print("Valid:" , is_valid_mnemonic(phrase))
