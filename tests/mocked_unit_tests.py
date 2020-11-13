"""
mocked Testing
"""
import unittest
import unittest.mock as mock
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app
import models

KEY_INPUT = "user"
KEY_EXPECTED = "expected"
NAME = "name"

class RecipesTestCase(unittest.TestCase):
    """
    RecipesTesttCase class.
    """
    def setUp(self):
        """
        test cases.
        """
        self.success_test_login = [
            {
                KEY_INPUT: {
                    NAME: "Risha Shah"
                },
                KEY_EXPECTED: "Risha Shah",
            }
        ]
        self.failure_test_login = [
            {
                KEY_INPUT: {
                    NAME: "Rishaaaa S"
                },
                KEY_EXPECTED: "Rishaaaa",
            }
        ]
        self.success_test_connect = [
            {
                KEY_INPUT: "Someone connected",
                KEY_EXPECTED: "Someone connected"
            }
        ]
        self.success_test_disconnect = [
            {
                KEY_INPUT: "Someone disconnected",
                KEY_EXPECTED: "Someone disconnected"
            }
        ]
    
    def test_google_login(self):
        """
        Test for google oAuth.
        """
        for test in self.success_test_login:
            print("TEST: " + str(test))
            print("TEST: " + str(test[KEY_INPUT]))
            print("TEST: " + str(test[KEY_EXPECTED]))
            login = app.on_new_google_user(test[KEY_INPUT]['name'])
            expected = test[KEY_EXPECTED]
            self.assertEqual(login, expected)
    # def test_onconnect(self):
    #     """
    #     Test for connect to socket.
    #     """
    #     for test in self.success_test_connect:
    #         con = app.on_connect()
    #         expected = test[KEY_EXPECTED]
    #         self.assertEqual(con, expected)
    # def test_ondisconnect(self):
    #     """
    #     Test for disconnect to socket.
    #     """
    #     for test in self.success_test_disconnect:
    #         print("TEST: " + str(test[KEY_INPUT]))
    #         discon = app.on_disconnect()
    #         print("TEST: " + str(discon))
    #         expected = test[KEY_EXPECTED]
    #         self.assertEqual(discon, expected)
            
if __name__ == "__main__":
    unittest.main()
