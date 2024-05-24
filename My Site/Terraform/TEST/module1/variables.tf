variable "file" {
  type = map(string)
  default = {
    path    = "./someFile.txt"
    content = "Some file content"
  }
}