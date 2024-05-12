variable "file" {
  type = tuple([string, number])
  default = ["./test1.txt", 1234]
}

variable "numberOfPets" {
  default = "10"
}
