#include "UUID.hpp"

std::string UUID::get()
{
  static std::random_device dev;
  static std::mt19937 rng(dev());

  std::uniform_int_distribution<int> dist(0, 15);

  const char *v = "0123456789abcdef";

  std::string res;
  for (int i = 0; i < 16; i++)
  {
    res += v[dist(rng)];
    res += v[dist(rng)];
  }
  return res;
}
