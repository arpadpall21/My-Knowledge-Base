##############################################################
# can be iterated over
##############################################################
# from enum import Enum


# class Color(Enum):
#     RED = 1                   # internal values must be uniqe
#     GREEN = 2
#     BLUE = 3


# for val in Color:
#     print(val)              # // -> [<Color.RED: 1>, <Color.GREEN: 2>, <Color.BLUE: 3>]


# # accessing members
# print(
#     Color.RED
# )
# print(
#     Color['RED']
# )

# the type is the enum class itself
# print(type(Color.BLUE))         # // -> Color (enum Color)




##############################################################
# functional syntax
##############################################################
# from enum import Enum


# Color = Enum('Color', ['RED', 'GREEN', 'BLUE'])

# print(Color.GREEN)



##############################################################
# get member names and values
##############################################################
# from enum import Enum


# class Color(Enum):
#     RED = 'red'
#     GREEN = 'green'
#     BLUE = 'blue'


# for member in Color:
#     print(member.name)          # // -> 'RED'  |  'GREEN'  |  'BLUE'
#     print(member.value)         # // -> 'red'  |  'green'  |  'blue'



##############################################################
# IntEnum & StrEnum
##############################################################
from enum import IntEnum, StrEnum


class Number(IntEnum):
    ONE = 1
    TWO = 2
    THREE = 3


class NumberStr(StrEnum):
    ONE = 'one'
    TWO = 'two'
    THREE = 'three'